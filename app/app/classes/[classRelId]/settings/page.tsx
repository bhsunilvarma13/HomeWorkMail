import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ArrowLeftIcon,
  Ban,
  Delete,
  DeleteIcon,
  Trash,
  Trash2,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage({
  params: { classRelId },
}: {
  params: { classRelId: string };
}) {
  const user = await getUserSession();

  const classUserRelationshipData = await prisma.classUserRelation.findUnique({
    where: {
      id: classRelId,
      userId: user.id,
    },
    include: {
      class: {
        include: {
          tenant: true,
          classUserRelations: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!classUserRelationshipData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        You do not have access to this class
      </div>
    );
  }

  const tenantUserRelationshipData = await prisma.tenantUserRelation.findFirst({
    where: {
      userId: user.id,
      tenantId: classUserRelationshipData.class.tenantId,
    },
  });

  if (!tenantUserRelationshipData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-3xl font-semibold">
        You do not have access to this class
      </div>
    );
  }

  if (
    tenantUserRelationshipData.role === "STUDENT" ||
    tenantUserRelationshipData.role === "USER" ||
    classUserRelationshipData.role === "STUDENT"
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-3xl font-semibold">
        You do not have access to this class
      </div>
    );
  }

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

  async function editClass(data: FormData) {
    "use server";
    const user = await getUserSession();

    const createdClassRelationship = await prisma.classUserRelation.update({
      where: {
        id: classRelId,
        userId: user.id,
      },
      data: {
        role: "TEACHER",
        class: {
          update: {
            name: data.get("name") as string,
            tenantId: data.get("tenant") as string,
          },
        },
      },
    });

    revalidatePath("/app/classes");
    redirect(`/app/classes/${createdClassRelationship.id}`);
  }

  async function deleteClass(data: FormData) {
    "use server";
    const user = await getUserSession();

    await prisma.class.delete({
      where: {
        id: data.get("classId") as string,
      },
    });

    revalidatePath("/app/classes");
    redirect(`/app/classes`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8 flex gap-4">
      <div className="sm:block hidden my-2">
        <Link href={`/app/classes/${classRelId}`}>
          <Button variant="outline" className="rounded-full p-3">
            <ArrowLeftIcon size={16} />
          </Button>
        </Link>
      </div>
      <div className="flex-grow">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold">
            {classUserRelationshipData.class.name}&apos;s settings
          </h1>
          <p className="text-sm text-muted-foreground">
            {classUserRelationshipData.class.tenant.name}
          </p>
        </div>
        <div>
          <form action={editClass} className="flex-grow">
            <div className="py-8 space-y-2">
              <div>
                <Label htmlFor="name">Class name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={classUserRelationshipData.class.name}
                />
              </div>
              <div>
                <Label htmlFor="name">Organization</Label>
                <Select
                  name="tenant"
                  defaultValue={classUserRelationshipData.class.tenantId}
                  required
                >
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
              <Button type="submit">Update</Button>
              <div className="my-2 sm:hidden block">
                <Link href="/app/classes">
                  <Button variant="destructive">Cancel</Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="my-8">
          <h2 className="text-2xl my-4 font-semibold">Teachers</h2>
          <ul>
            {classUserRelationshipData.class.classUserRelations.find(
              (cur) => cur.role === "TEACHER"
            ) ? (
              classUserRelationshipData.class.classUserRelations
                .filter((cur) => cur.role === "TEACHER")
                .map((cur) => (
                  <li key={cur.id} className="my-2 flex">
                    <div className="flex-grow">
                      <p className="text-sm font-semibold">{cur.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cur.user.email}
                      </p>
                    </div>
                    {cur.id !== classRelId && (
                      <div className="flex gap-4">
                        <Select
                          value={cur.role}
                          onValueChange={async () => {
                            "use server";

                            const classUserRelation =
                              await prisma.classUserRelation.update({
                                where: {
                                  id: cur.id,
                                },
                                data: {
                                  role:
                                    cur.role === "TEACHER"
                                      ? "STUDENT"
                                      : "TEACHER",
                                },
                                include: {
                                  class: true,
                                },
                              });

                            const tenantUserRelationshipData =
                              await prisma.tenantUserRelation.findFirst({
                                where: {
                                  userId: cur.user.id,
                                  tenantId: classUserRelation.class.tenantId,
                                },
                              });

                            if (!tenantUserRelationshipData) {
                              return;
                            }

                            await prisma.tenantUserRelation.update({
                              where: {
                                id: tenantUserRelationshipData.id,
                              },
                              data: {
                                role:
                                  tenantUserRelationshipData.role === "TEACHER"
                                    ? "STUDENT"
                                    : "TEACHER",
                              },
                            });

                            revalidatePath(
                              `/app/classes/${classRelId}/settings`
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEACHER">Teacher</SelectItem>
                            <SelectItem value="STUDENT">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          className="rounded-full p-3"
                          onClick={async () => {
                            "use server";

                            await prisma.classUserRelation.delete({
                              where: {
                                id: cur.id,
                              },
                            });
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </li>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No teachers yet</p>
            )}
          </ul>
        </div>
        <div className="my-8">
          <h2 className="text-xl font-semibold">Students</h2>
          <ul>
            {classUserRelationshipData.class.classUserRelations.find(
              (cur) => cur.role === "STUDENT"
            ) ? (
              classUserRelationshipData.class.classUserRelations
                .filter((cur) => cur.role === "STUDENT")
                .map((cur) => (
                  <li key={cur.id} className="my-2 flex">
                    <div className="flex-grow">
                      <p className="text-sm font-semibold">{cur.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cur.user.email}
                      </p>
                    </div>
                    {cur.id !== classRelId && (
                      <div className="flex gap-4">
                        <Select
                          value={cur.role}
                          onValueChange={async () => {
                            "use server";

                            const classUserRelation =
                              await prisma.classUserRelation.update({
                                where: {
                                  id: cur.id,
                                },
                                data: {
                                  role:
                                    cur.role === "TEACHER"
                                      ? "STUDENT"
                                      : "TEACHER",
                                },
                                include: {
                                  class: true,
                                },
                              });

                            const tenantUserRelationshipData =
                              await prisma.tenantUserRelation.findFirst({
                                where: {
                                  userId: cur.user.id,
                                  tenantId: classUserRelation.class.tenantId,
                                },
                              });

                            if (!tenantUserRelationshipData) {
                              return;
                            }

                            await prisma.tenantUserRelation.update({
                              where: {
                                id: tenantUserRelationshipData.id,
                              },
                              data: {
                                role:
                                  tenantUserRelationshipData.role === "TEACHER"
                                    ? "STUDENT"
                                    : "TEACHER",
                              },
                            });

                            revalidatePath(
                              `/app/classes/${classRelId}/settings`
                            );
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEACHER">Teacher</SelectItem>
                            <SelectItem value="STUDENT">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          className="rounded-full p-3"
                          onClick={async () => {
                            "use server";

                            await prisma.classUserRelation.delete({
                              where: {
                                id: cur.id,
                              },
                            });
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </li>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No teachers yet</p>
            )}
          </ul>
        </div>
        <Card className="my-8 bg-red-500 text-white">
          <CardHeader>
            <CardTitle>Delete Class</CardTitle>
            <CardDescription className="flex items-center gap-1 text-white">
              <Ban size={16} />
              Caution - This action irreversibly deletes this class.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <form action={deleteClass}>
              <input
                type="hidden"
                name="classId"
                value={classUserRelationshipData.classId}
                autoComplete="off"
              />
              <Button className="flex gap-2">
                <Trash size={16} /> Delete
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
