import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { UploadAvatarFormSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppState } from "@/lib/providers/state-provider";
import { getUserById, updateUserById } from "@/lib/supabase/queries";
import { useServerInsertedHTML } from "next/navigation";

const AvatarUpload = () => {
  const supabase = createClientComponentClient();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof UploadAvatarFormSchema>>({
    mode: "onChange",
    defaultValues: {
      avatar: "",
    },
  });

  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UploadAvatarFormSchema>
  > = async (values) => {
    const file = values.avatar?.[0];
    if (!file) {
      return toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      //fetch current user data
      const profile = await getUserById(user.id)

        // delete old avatar if exists
      if (profile?.avatarUrl) {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([profile.avatarUrl]);

          if (deleteError) {
            console.error("Failed to delete old avatar:", deleteError.message);
            toast({
              title: "Error",
              variant: "destructive",
              description: "Failed to delete old avatar.",
            });
            return;
          }
      }

      //upload new avatar
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`avatar-${user.id}`, file, { cacheControl: "5", upsert: true });

      if (error) {
        return toast({
          title: "Error",
          variant: "destructive",
          description: "Something went wrong on uploading image!",
        });
      } else {
        const { data: userData, error: userError } = await updateUserById(user.id,{avatarUrl: data.path});

        if (userError) {
          return toast({
            title: "Error",
            variant: "destructive",
            description: "Something went wrong on updating user data!",
          });
        }
        if (userData) {
          toast({
            title: "Success",
            description: "Avatar uploaded successfully!",
          });
        }
      }
    } catch (error) {
      console.log("image-uploading issue:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="bannerImage" className=" text-sm text-muted-foreground">
        Avatar Image
      </Label>
      <Input
        className=" cursor-pointer"
        id="bannerImage"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register("avatar", { required: "Banner Image is required!" })}
      />
      <small className=" text-red-600">
        {errors.avatar?.message?.toString()}
      </small>
      <Button disabled={isUploading} type="submit">
        {!isUploading ? "Upload Avatar" : <Loader />}
      </Button>
    </form>
  );
};

export default AvatarUpload;
