import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ClassUserRelation, Homework, Status } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

const CreateHomework = async () => {
  async function createClass(data: FormData) {
    "use server";

    const homework = await prisma.homework.create({
      data: {
        heading: data.get("name") as string,
        classId: data.get("class") as string,
      },
    });

    await prisma.homeworkStudentRelation.create({
      data: {
        homeworkId: homework.id,
        userId: (await getUserSession()).id,
      },
    });

    redirect(`/app/homeworks/add/${homework.id}`);
  }

  const user = await getUserSession();

  const classes = await prisma.classUserRelation.findMany({
    where: {
      userId: user.id,
      role: "TEACHER",
    },
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2" size={16} />
          Create homework
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={createClass} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Homework</DialogTitle>
            <DialogDescription>
              This action create a homework for your class and redirect you to
              the homework page.
            </DialogDescription>
          </DialogHeader>
          <Input placeholder="Homework name" name="name" required />
          <Select name="class" required>
            <SelectTrigger>
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Public</SelectItem>
              {classes.map((classItem) => (
                <SelectItem value={classItem.classId} key={classItem.classId}>
                  {classItem.class.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

async function Homeworks() {
  const classUserRelation = await prisma.classUserRelation.findMany({
    where: {
      userId: (await getUserSession()).id,
      OR: [
        {
          role: "TEACHER",
        },
        {
          role: "STUDENT",
        },
      ],
    },

    include: {
      class: {
        include: {
          homeworks: {
            orderBy: {
              deadline: "asc",
            },
          },
        },
      },
    },
  });

  const homeworks = classUserRelation.map(
    (relation) => relation.class.homeworks
  );

  const content =
    homeworks.length > 0 ? (
      <Table>
        <TableCaption>Your list of homeworks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Homework</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classUserRelation.map((relation) =>
            relation.class.homeworks.map((homework) =>
              relation.role === "TEACHER" ? (
                <TableRow>
                  <TableCell className="w-[180px]">
                    <Select
                      value={homework.shown ? "TRUE" : "FALSE"}
                      onValueChange={async () => {
                        "use server";

                        await prisma.homework.update({
                          where: {
                            id: homework.id,
                          },

                          data: {
                            shown: homework.shown ? false : true,
                          },
                        });

                        revalidatePath("/app/homeworks");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRUE">Open</SelectItem>
                        <SelectItem value="FALSE">Close</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/app/homeworks/${homework.id}`}
                      className="underline"
                    >
                      {homework.heading}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/app/classes/${relation.id}`}
                      className="underline"
                    >
                      {relation.class.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {homework.deadline
                      ? String(homework.deadline)
                      : "No Deadline"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/app/homeworks/add/${homework.id}`}
                      className="underline"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {prisma.homeworkStudentRelation
                    .findFirst({
                      where: {
                        homeworkId: homework.id,
                        userId: relation.userId,
                      },

                      include: {
                        homework: true,
                      },
                    })
                    .then((hsr) => {
                      if (!hsr || !homework.shown) return null;

                      return (
                        <TableRow>
                          <TableCell className="w-[180px]">
                            <Select
                              defaultValue={hsr.status}
                              onValueChange={async (e) => {
                                "use server";

                                await prisma.homeworkStudentRelation.update({
                                  where: {
                                    id: hsr.id,
                                  },

                                  data: {
                                    status: e as Status,
                                  },
                                });

                                revalidatePath("/app/homeworks");
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link
                              href={`/app/homeworks/${homework.id}`}
                              className="underline"
                            >
                              {homework.heading}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/app/classes/${relation.id}`}
                              className="underline"
                            >
                              {relation.class.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {homework.deadline
                              ? String(homework.deadline)
                              : "No Deadline"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
              )
            )
          )}
        </TableBody>
      </Table>
    ) : (
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Create your first class</CardTitle>
            <CardDescription>
              You have not created any classes yet. Click the button above to
              create your first class. You can invite students to your class by
              sharing the invite key.
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    );

  return content;
}

export default async function Homeworkspage() {
  return (
    <div className="py-8 max-w-7xl mx-auto space-y-8 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Homeworks</h1>
        <CreateHomework />
      </div>
      <Homeworks />
    </div>
  );
}
