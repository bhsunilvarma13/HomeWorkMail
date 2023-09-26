import CopyInviteKey from "@/components/copyInviteKey";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Class } from "@prisma/client";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

type ClassPageParams = {
  params: {
    classRelId: string;
  };
};

async function Homeworks({ classId }: { classId: string }) {
  const homeworks = await prisma.homework.findMany({
    where: {
      classId: classId,
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return (
    <div>
      {homeworks.map((homework) => (
        <Card key={homework.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/app/homeworks/${homework.id}`}
                className="underline"
              >
                {homework.heading}
              </Link>
            </CardTitle>
            <CardDescription>
              Deadline: {homework.deadline ? String(homework.deadline) : "None"}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default async function ClassesPage({
  params: { classRelId },
}: ClassPageParams) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0">
      <div className="sticky bg-background py-8 top-0 flex items-center gap-4">
        <div>
          <Link href="/app/classes">
            <Button variant="outline" className="rounded-full p-3">
              <ArrowLeftIcon size={16} />
            </Button>
          </Link>
        </div>
        <div className="flex-grow space-y-1.5">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-semibold">
              {classUserRelationshipData.class.name}
            </h1>
            {(tenantUserRelationshipData.role === "TEACHER" ||
              tenantUserRelationshipData.role === "OWNER" ||
              tenantUserRelationshipData.role === "ADMIN") && (
              <CopyInviteKey
                inviteKey={classUserRelationshipData.class.inviteKey}
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {classUserRelationshipData.class.tenant.name}
          </p>
        </div>
        {(tenantUserRelationshipData.role === "TEACHER" ||
          tenantUserRelationshipData.role === "OWNER" ||
          tenantUserRelationshipData.role === "ADMIN") && (
          <div>
            <Link href={`/app/classes/${classRelId}/settings`}>
              <Button variant="outline" className="p-3 rounded-full">
                <SettingsIcon size={16} />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Homeworks classId={classUserRelationshipData.classId} />
    </div>
  );
}
