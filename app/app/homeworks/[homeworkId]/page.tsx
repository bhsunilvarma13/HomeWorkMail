import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

export default async function HomeworkPage({
  params: { homeworkId },
}: {
  params: { homeworkId: string };
}) {
  const homework = await prisma.homework.findUnique({
    where: {
      id: homeworkId,
    },

    include: {
      class: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!homework) {
    return <p>Homework not found</p>;
  }

  if (!homework.class) {
    return <p>Class not found</p>;
  }

  if (!homework.shown) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <p className="text-xl font-semibold">
          This homework is currently inactive
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{homework.heading}</h1>
          <Badge className="mt-1">{homework.class.name}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {homework.deadline
            ? `Deadline: ${String(homework.deadline)}`
            : "No Deadline"}
        </p>
      </div>
      <div></div>
    </div>
  );
}
