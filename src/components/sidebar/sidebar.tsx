import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });

  // user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // subscription
  const { data: subData, error: subError } = await getUserSubscriptionStatus(
    user.id
  );

  // folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  // error
  if (subError || foldersError) redirect("/dashboard");

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
        
    </aside>
  );
};

export default Sidebar;
