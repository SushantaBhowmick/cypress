import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import UserProfile from "@/components/userProfile/UserProfile";

const UserProfilePage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {data:{user}} = await supabase.auth.getUser();
  if (!user) return;

  return <div>
    <UserProfile user={user}/>
  </div>;
};

export default UserProfilePage;
