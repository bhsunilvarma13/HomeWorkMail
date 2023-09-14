import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

async function Content() {
  const user = await getUserSession();

  const userClasses = await prisma.classUserRelation.findMany({
    where: {
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

  return (
    <div>
      {userClasses.length > 0 ? (
        <div className="py-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {userClasses.map((classRelationship) => (
            <div key={classRelationship.id}>
              <Link href={`/app/classes/${classRelationship.id}`}>
                <Card className="hover:border-gray-700">
                  <CardContent>
                    <CardHeader>
                      <CardTitle>{classRelationship.class.name}</CardTitle>
                      <CardDescription>
                        {classRelationship.class.tenant.name}
                      </CardDescription>
                    </CardHeader>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8">
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
        </div>
      )}
    </div>
  );
}

export default async function ClassesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Classes</h1>
        <Link href="/app/classes/add">
          <Button variant="outline" className="flex gap-2">
            <PlusCircle size={16} />
            Create Class
          </Button>
        </Link>
      </div>
      <Content />
    </div>
  );
}
