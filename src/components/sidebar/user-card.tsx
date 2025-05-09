import { Subscription } from "@/lib/supabase/supabase-types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CypressProfileIcon from "../icons/cypressProfileIcon";
import { LogOut } from "lucide-react";
import LogoutButton from "../global/logout-button";
import ModeToggle from "../global/mode-toggle";
import Link from "next/link";
import UserCardToggle from "../userProfile/UserCardToggle";
import { getUserById } from "@/lib/supabase/queries";

interface UserCardProps {
  subscription: Subscription | null;
}

const UserCard: React.FC<UserCardProps> = async ({ subscription }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const response = await getUserById(user.id)

  let avatarPath;
  if(!response) return;
  if(!response.avatarUrl) avatarPath='';
  else{
    avatarPath=supabase.storage
        .from('avatars')
        .getPublicUrl(response.avatarUrl)?.data.publicUrl;
  }
  const profile={
    ...response,
    avatarUrl:avatarPath
  }

  return (
    <article className="hidden
    sm:flex 
    justify-between 
    items-center 
    px-4 
    py-2 
    dark:bg-Neutrals/neutrals-12
    rounded-3xl
">
        <UserCardToggle subscription={subscription} profile={profile} />
        <div className="flex items-center justify-center">
            <LogoutButton>
            <LogOut />
            </LogoutButton>
            <ModeToggle />
        </div>
    </article>
  );
};

export default UserCard;
