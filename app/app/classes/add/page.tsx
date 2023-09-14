import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowLeftIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AddClass() {
  const user = await getUserSession();

  const UserTenants = await prisma.tenantUserRelation.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          role: "OWNER",
        },
        {
          role: "ADMIN",
        },
        {
          role: "TEACHER",
        },
      ],
    },

    include: {
      tenant: true,
    },
  });

  async function createClass(data: FormData) {
    "use server";
    const user = await getUserSession();

    const usersTenant = await prisma.tenantUserRelation.findFirst({
      where: {
        userId: user.id,
        tenantId: data.get("tenant") as string,
      },
      include: {
        tenant: {
          include: {
            classes: true,
          },
        },
      },
    });

    if (!usersTenant) {
      throw new Error("Invalid tenant");
    }

    if (
      usersTenant.tenant.plan === "FREE" &&
      usersTenant.tenant.classes.length >= 1
    ) {
      return redirect("/pricing");
    }

    const createdClassRelationship = await prisma.classUserRelation.create({
      data: {
        role: "TEACHER",
        class: {
          create: {
            name: data.get("name") as string,
            tenantId: data.get("tenant") as string,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    revalidatePath("/app/classes");
    redirect(`/app/classes/${createdClassRelationship.id}`);
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-4">
      <div className="my-2 hidden sm:block">
        <Link href="/app/classes">
          <Button variant="outline" className="rounded-full p-3">
            <ArrowLeftIcon size={16} />
          </Button>
        </Link>
      </div>
      <form action={createClass} className="flex-grow">
        <div>
          <h1 className="text-3xl font-semibold">Create Class</h1>
          <p className="text-sm text-muted-foreground my-1">
            This action will create a class and generate an invite key to share
            with your students.
          </p>
        </div>
        <div className="py-8 space-y-2">
          <div>
            <Label htmlFor="name">Class name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="name">Organization</Label>
            <Select name="tenant" required>
              <SelectTrigger>
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                {UserTenants.map((tenant) => (
                  <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit">Create</Button>
          <div className="my-2 sm:hidden block">
            <Link href="/app/classes">
              <Button variant="destructive">Cancel</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
