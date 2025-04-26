import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import UserProfile from "@/components/userProfile/UserProfile";
import { getUserById } from "@/lib/supabase/queries";

const UserProfilePage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {data:{user}} = await supabase.auth.getUser();
  if (!user) return;
  const userData = await getUserById(user.id);
  if(!userData) return;

  return <div>
    <UserProfile user={userData}/>
  </div>;
};

export default UserProfilePage;
