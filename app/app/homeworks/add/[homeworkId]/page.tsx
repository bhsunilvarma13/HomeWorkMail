import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prisma from "@/lib/prisma";
import { ArrowLeft, Plus, Save, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function Sections({ homeworkId }: { homeworkId: string }) {
  const sections = await prisma.section.findMany({
    where: {
      homeworkId: homeworkId,
    },
  });

  async function createSection() {
    "use server";

    await prisma.section.create({
      data: {
        homeworkId: homeworkId,
      },
    });

    revalidatePath(`/app/homeworks/add/${homeworkId}`);
  }

  async function deleteSection(data: FormData) {
    "use server";

    await prisma.section.delete({
      where: {
        id: data.get("sectionId") as string,
      },
    });

    revalidatePath(`/app/homeworks/add/${homeworkId}`);
  }

  async function saveSectionDetails(data: FormData) {
    "use server";

    await prisma.section.update({
      where: {
        id: data.get("sectionId") as string,
      },
      data: {
        heading: data.get("sectionName") as string,
        description: data.get("sectionDescription") as string,
      },
    });

    revalidatePath(`/app/homeworks/add/${homeworkId}`);
  }

  return (
    <>
      {sections.map((section) => (
        <section className="my-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <input type="hidden" name="sectionId" value={section.id} />
                <Input
                  placeholder="Section Heading"
                  name="sectionName"
                  className="text-2xl font-semibold leading-none tracking-tight border-0 border-b"
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <form action={saveSectionDetails}>
                        <input type="hidden" name="sectionHeading" />
                        <input type="hidden" name="sectionDescription" />
                        <Button
                          variant="outline"
                          className="rounded-full p-3"
                          type="submit"
                        >
                          <Save size={16} />
                        </Button>
                      </form>
                    </TooltipTrigger>
                    <TooltipContent>Save section details</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <form action={deleteSection}>
                        <input
                          type="hidden"
                          name="sectionId"
                          value={section.id}
                        />
                        <Button
                          variant="destructive"
                          className="rounded-full p-3"
                          type="submit"
                        >
                          <Trash size={16} />
                        </Button>
                      </form>
                    </TooltipTrigger>
                    <TooltipContent>Delete Section</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>
                <Input
                  placeholder="Section Description"
                  name="sectionDescription"
                  className="text-sm font-medium leading-none tracking-tight border-0"
                />
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      ))}
      <form action={createSection}>
        <Button
          className="w-full flex items-center border-dashed mt-8"
          variant="outline"
          type="submit"
        >
          <Plus size={16} className="mr-2" />
          <span>Add Section</span>
        </Button>
      </form>
    </>
  );
}

export default async function CreateHomeworkPage({
  params: { homeworkId },
}: {
  params: { homeworkId: string };
}) {
  const homework = await prisma.homework.findUnique({
    where: {
      id: homeworkId,
    },

    include: {
      class: true,
    },
  });

  if (!homework || !homework.class) {
    return <div>Homework not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8 flex gap-4">
      <div>
        <Link href="/app/homeworks">
          <Button variant="outline" className="rounded-full p-3 mt-2">
            <ArrowLeft size={16} />
          </Button>
        </Link>
      </div>
      <div className="flex-grow">
        <div className="flex">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold">{homework.heading}</h1>
            <p className=" text-muted-foreground text-sm">
              {homework.class.name}
            </p>
          </div>
          <Button className="ml-auto">Send Homework</Button>
        </div>

        <Sections homeworkId={homeworkId} />
      </div>
    </div>
  );
}
