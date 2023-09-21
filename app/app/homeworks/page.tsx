import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function HomeworksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Homeworks</h1>
        <Link href="/app/homeworks/add">
          <Button variant="outline" className="flex gap-2">
            <PlusCircle size={16} />
            Create Homework
          </Button>
        </Link>
      </div>
    </div>
  );
}
