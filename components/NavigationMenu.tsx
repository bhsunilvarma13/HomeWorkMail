"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/app/homeworks",
    label: "Homeworks",
  },
  {
    href: "/app/classes",
    label: "Classes",
  },
  {
    href: "/app/overview",
    label: "Overview",
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto p-4 border-y flex justify-center">
      <ul className="flex gap-4">
        {links.map(({ href, label }) => (
          <li
            key={href}
            className={`${
              pathname.split("/")[2] === href.split("/")[2] &&
              "dark:bg-white bg-black dark:text-black text-white font-medium"
            } text-sm py-1 px-2 rounded-sm`}
          >
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
