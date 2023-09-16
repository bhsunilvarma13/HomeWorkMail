import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type InvitePageProps = {
  params: {
    inviteKey: string;
  };
};

export default async function InvitePage({
  params: { inviteKey },
}: InvitePageProps) {
  const user = await getUserSession();

  const classRes = await prisma.class.findUnique({
    where: {
      inviteKey: inviteKey,
    },

    include: {
      classUserRelations: true,
    },
  });

  if (!classRes) {
    return (
      <div>
        <div className="max-w-5xl mx-auto flex items-center justify-center my-32">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-black text-center">
                Class not found
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const classUser = classRes.classUserRelations.find(
    (relation) => relation.userId === user.id
  );

  if (classUser) {
    redirect(`/app/classes/${classUser.id}`);
  }

  async function joinClass(data: FormData) {
    "use server";

    const user = await getUserSession();

    const tenantDetails = await prisma.tenantUserRelation.findFirst({
      where: {
        tenantId: data.get("tenantId") as string,
        userId: user.id,
      },
    });

    let cur;

    if (tenantDetails) {
      cur = await prisma.classUserRelation.create({
        data: {
          classId: data.get("classId") as string,
          userId: user.id,
        },
      });
    } else {
      await prisma.tenantUserRelation.create({
        data: {
          tenantId: data.get("tenantId") as string,
          userId: user.id,
          role: "STUDENT",
        },
      });

      cur = await prisma.classUserRelation.create({
        data: {
          classId: data.get("classId") as string,
          userId: user.id,
        },
      });
    }

    revalidatePath("/app/classes");
    redirect(`/app/classes/${cur.id}`);
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto flex items-center justify-center my-32">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-black text-center">
              {classRes?.name}
            </h1>
          </div>
          <form
            action={joinClass}
            className="flex flex-col items-center justify-center mt-4"
          >
            <input type="hidden" name="classId" value={classRes.id} />
            <input type="hidden" name="tenantId" value={classRes.tenantId} />
            <Button type="submit">Join Class</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
