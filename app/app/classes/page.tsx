import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Class } from "@prisma/client";

export default async function ClassesPage() {
  async function createClass(data: FormData) {
    "use server";

    const user = await getUserSession();

    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      include: {
        tenantUserRelations: {
          where: {
            role: "OWNER",
          },
        },
      },
    });

    if (!prismaUser) throw new Error("User not found");

    const createdClass = await prisma.class.create({
      data: {
        name: data.get("name") as string,
        tenantId: prismaUser.tenantUserRelations[0].tenantId,
        Users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath("/app/classes");
    redirect(`/app/classes/${createdClass.id}`);
  }

  const user = await getUserSession();

  const userClasses = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      classes: true,
    },
  });

  if (!userClasses) throw new Error("User not found");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Classes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <PlusCircle size={20} />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createClass}>
              <DialogHeader>
                <DialogTitle>Create Class</DialogTitle>
                <DialogDescription>
                  This action will create a class and generate an invite key to
                  share with your students.
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 space-y-2">
                <Label htmlFor="name">Class name</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="py-8">
        {userClasses.classes.length > 0 ? (
          userClasses.classes.map((c: Class) => (
            <div key={c.id}>
              {c.name} - {c.inviteKey}
            </div>
          ))
        ) : (
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle>Create your first class</CardTitle>
                <CardDescription>
                  You have not created any classes yet. Click the button above
                  to create your first class. You can invite students to your
                  class by sharing the invite key.
                </CardDescription>
              </CardHeader>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
