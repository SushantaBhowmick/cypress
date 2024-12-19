"use client";
import { ListCheckIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import DatePicker from "./date-picker";
import { Button } from "../ui/button";
import CollaboratorSearch from "../global/collaborator-search";
import { User } from "@/lib/supabase/supabase-types";
import AssignerSearch from "./assigner-search";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useToast } from "@/hooks/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { tasks } from "../../../migrations/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import Loader from "../global/Loader";

const TaskForm = () => {
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const { workspaceId } = useAppState();
  const { user, subscription } = useSupabaseUser();
  const { open, setOpen } = useSubscriptionModal();
  const [submitError, setSubmitError] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof taskSchema>>({
    mode: "onChange",
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", assignedTo: "" },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof taskSchema>> = async (
    formData
  ) => {
    console.log(formData);
  };

  const addCollaborator = (user: User) => {
    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(true);
      return;
    }
    setCollaborators([user]);
  };
  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };
  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <ListCheckIcon size={20} />
        Task
      </p>
      <Separator />
      <Form {...form}>
        <form
          action=""
          className=" w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">
              Title
            </Label>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label
              htmlFor="description"
              className="text-sm text-muted-foreground"
            >
              Description
            </Label>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Task Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 
          <Label htmlFor="dueDate" className="text-sm text-muted-foreground">
            Due Date
          </Label>
          <DatePicker /> */}

            <Separator />
            <AssignerSearch
              existingCollaborators={collaborators}
              getCollaborator={(user) => addCollaborator(user)}
            >
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="AssignTo"
                  className="text-sm text-muted-foreground"
                >
                  Assign To
                </Label>
                <span className=" cursor-pointer">
                  <PlusCircle />
                </span>
              </div>
            </AssignerSearch>
            <div className="mt-4">
              {collaborators.length ? (
                collaborators.map((c) => (
                  <div
                    className="p-4 flex
                justify-between
                items-center"
                    key={c.id}
                  >
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="/avatars/7.png" />
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className="text-sm 
                          gap-2
                          text-muted-foreground
                          overflow-hidden
                          overflow-ellipsis
                          sm:w-[300px]
                          w-[140px]
                        "
                      >
                        {c.email}
                      </div>
                    </div>
                    {/* <Button
                      variant="secondary"
                      onClick={() => removeCollaborator(c)}
                    >
                      Remove
                    </Button> */}
                  </div>
                ))
              ) : (
                <span className="flex justify-center text-sm text-muted-foreground w-full">
                  Not assigned
                </span>
              )}
            </div>
            <Separator />
          </div>
          {submitError && <FormMessage>{submitError}</FormMessage>}
          <Button disabled={isLoading} type="submit" className="w-full mt-5">
            {!isLoading ? "Submit" : <Loader />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
