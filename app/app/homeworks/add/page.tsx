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
import { ArrowLeft, Plus, Save, Trash } from "lucide-react";
import Link from "next/link";

export default async function CreateHomeworkPage() {
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
            <h1 className="text-3xl font-semibold">Create Homework</h1>
            <p className=" text-muted-foreground text-sm">
              You can have multiple sections inside a single homework and
              multiple questions inside a single section.
            </p>
          </div>
          <Button className="ml-auto">Send Homework</Button>
        </div>
        <section className="my-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <Input
                  placeholder="Section Name"
                  name="sectionName"
                  className="text-2xl font-semibold leading-none tracking-tight border-0 border-b"
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="rounded-full p-3">
                        <Save size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        className="rounded-full p-3"
                      >
                        <Trash size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
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
        <Button
          className="w-full flex items-center border-dashed"
          variant="outline"
        >
          <Plus size={16} className="mr-2" />
          <span>Add Section</span>
        </Button>
      </div>
    </div>
  );
}
