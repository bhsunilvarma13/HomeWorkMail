import { ModeToggle } from "@/components/darkModebutton";
import { Button } from "@/components/ui/button";

export default async function HomeworkPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen">
      <div className="flex h-[20vh] items-center justify-between max-w-5xl mx-auto border-b sticky top-0 bg-white dark:bg-black">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold">Homework Title</h1>
          <p className="text-sm text-muted-foreground">Deadline: </p>
        </div>
        <ModeToggle />
      </div>
      {children}
    </main>
  );
}
