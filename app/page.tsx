import { ModeToggle } from "@/components/darkModebutton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="w-screen min-h-screen">
      <div className="max-w-5xl mx-auto h-[10vh] flex items-center justify-between px-4">
        <Link href="/">
          <span className="text-2xl font-black">HWM</span>
        </Link>
        <div className="flex items-center">
          <Link href="/app">
            <Button variant="link" className="mr-4">
              Sign In
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
      <div className="max-w-5xl mx-auto h-[80vh] grid place-items-center px-4">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-3xl font-black text-center sm:text-7xl">
            Revamp your homework experience
          </h1>
          <p className="sm:text-base text-xs sm:w-3/4 w-full text-center font-light leading-relaxed">
            Elevate the way you create and distribute homework tasks with
            HomeWorkMail. Our cutting-edge SaaS platform streamlines the entire
            process, making it seamless for educators to craft, allocate, and
            track assignments, all while engaging students like never before.
            Say goodbye to paper trails and hello to the future of education.
            Experience simplicity, efficiency, and effectiveness in one
            platform. Dive into the next era of homework management with
            HomeWorkMail.
          </p>
          <div className="space-x-4">
            <Link href="/app">
              <Button variant="outline">Get Started</Button>
            </Link>
            <Link href="/pricing">
              <Button>Upgrade</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[10vh] border-t text-center text-xs font-extralight flex items-center justify-center text-gray-500">
        @2023 HomeWorkMail. All rights reserved.
      </div>
    </main>
  );
}
