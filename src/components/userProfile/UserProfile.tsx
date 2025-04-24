"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { User } from "@/lib/supabase/supabase-types";
// import { updateUserProfile } from "@/lib/supabase/queries"; // You need to implement this

export default function UserProfile({ user }: { user: Partial<User> }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === "billingAddress"
        ? value
        : value,
    }));
  };

  const handleSave = async () => {
    // try {
    //   setIsLoading(true);
    //   const { error } = await updateUserProfile(userData); // Make sure this API handles Partial<User>
    //   setIsLoading(false);

    //   if (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to update profile.",
    //       variant: "destructive",
    //     });
    //   } else {
    //     toast({
    //       title: "Success",
    //       description: "Profile updated successfully.",
    //     });
    //   }
    // } catch (err) {
    //   setIsLoading(false);
    //   toast({
    //     title: "Error",
    //     description: "Something went wrong!",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {userData.avatarUrl ? (
              <Image
                src={userData.avatarUrl}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full" />
            )}
            <Input
              placeholder="Avatar URL"
              name="avatarUrl"
              value={userData.avatarUrl || ""}
              onChange={handleChange}
            />
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
            placeholder="Billing Address (JSON)"
            value={typeof userData.billingAddress === "string"
              ? userData.billingAddress
              : JSON.stringify(userData.billingAddress ?? "")}
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
