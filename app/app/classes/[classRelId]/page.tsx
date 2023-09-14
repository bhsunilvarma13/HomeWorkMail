import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowLeftIcon, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";

type ClassPageParams = {
  params: {
    classRelId: string;
  };
};

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        You do not have access to this class
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4">
        <div>
          <Link href="/app/classes">
            <Button variant="outline" className="rounded-full p-3">
              <ArrowLeftIcon size={16} />
            </Button>
          </Link>
        </div>
        <div className="flex-grow space-y-1.5">
          <h1 className="text-3xl font-semibold">
            {classUserRelationshipData.class.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {classUserRelationshipData.class.tenant.name}
          </p>
        </div>
      </div>
    </div>
  );
}
