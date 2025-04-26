"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { User } from "@/lib/supabase/supabase-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CypressProfileIcon from "../icons/cypressProfileIcon";
import { Pencil } from "lucide-react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import AvatarUpload from "./AvatarUpload";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ImageShowing } from "@/lib/hooks/imageShowing";
import { updateUserById } from "@/lib/supabase/queries";
// import { updateUserProfile } from "@/lib/supabase/queries"; // You need to implement this

export default function UserProfile({ user }: { user: Partial<User> }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(user);
  const supabase = createClientComponentClient()

  if(!userData.avatarUrl) userData.avatarUrl=''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === "billingAddress" ? value : value,
    }));
  };

  const handleSave = async () => {
    try {
      if(!userData.id) return;
      console.log(userData.billingAddress)
      console.log()
      setIsLoading(true);
      let user={
        fullName:userData.fullName,
        billingAddress:userData.billingAddress
      }
      const { error } = await updateUserById(userData.id,user); // Make sure this API handles Partial<User>
      setIsLoading(false);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center mb-4 relative">
            <Avatar className="w-40 h-40 relative">
              <AvatarImage className=" object-cover object-top" src={ImageShowing(userData.avatarUrl,"avatars")} />
              <AvatarFallback>
                <CypressProfileIcon height={96} width={96} />
              </AvatarFallback>
            </Avatar>
            <div className="absolute cursor-pointer right-64 top-28 ">
              <CustomDialogTrigger
                header="Upload Avatar"
                content={<AvatarUpload />}
              >
                <div className="bg-gray-300 rounded-full p-2 px-3">
                <Pencil color="black" />
                </div>
              </CustomDialogTrigger>
            </div>
          </div>

          <Input
            name="fullName"
            placeholder="Full Name"
            value={userData.fullName || ""}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={userData.email || ""}
            onChange={handleChange}
            disabled
          />
          <Input
            name="billingAddress"
            placeholder="Billing Address"
            value={
              typeof userData.billingAddress === "string"
                ? userData.billingAddress
                : JSON.stringify(userData.billingAddress ?? "")
            }
            onChange={handleChange}
          />

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
