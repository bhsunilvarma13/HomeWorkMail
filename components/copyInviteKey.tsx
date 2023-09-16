"use client";
import { CheckCheck, Copy } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;

const DOMAIN = vercel ? `https://${vercel}` : "http://localhost:3000";

export default function CopyInviteKey({ inviteKey }: { inviteKey: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Badge
      variant="outline"
      className={`flex gap-2 cursor-pointer p-2 px-4 font-normal ${
        copied && "bg-green-600 text-white"
      }`}
      onClick={() => {
        setCopied(true);

        navigator.clipboard.writeText(
          `${DOMAIN}/app/classes/invite/${inviteKey}`
        );

        setTimeout(() => {
          setCopied(false);
        }, 500);
      }}
    >
      {copied ? <CheckCheck size={12} /> : <Copy size={12} />}

      <span className="text-xs">Invite Key</span>
    </Badge>
  );
}
