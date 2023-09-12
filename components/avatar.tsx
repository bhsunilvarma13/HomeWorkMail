import { getUserSession } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AvatarComp() {
  const user = await getUserSession();

  return (
    <Avatar>
      <AvatarImage src={user.image || ""} alt="Profile Picture" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
