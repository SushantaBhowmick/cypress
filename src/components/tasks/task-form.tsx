"use client";
import { ListCheckIcon, Plus, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import DatePicker from "./date-picker";
import { Button } from "../ui/button";
import CollaboratorSearch from "../global/collaborator-search";
import { tasks, User } from "@/lib/supabase/supabase-types";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { addCollaborators, createTask } from "@/lib/supabase/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "@/lib/types";
import Loader from "../global/Loader";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

const TaskForm = () => {
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const { state, workspaceId, dispatch } = useAppState();
  const { user, subscription } = useSupabaseUser();
  const { open, setOpen } = useSubscriptionModal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof taskFormSchema>>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  if (!workspaceId || !user) return;
  const addCollaborator = async (profile: User) => {
    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(true);
      return;
    }

    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
  };

  const submitHandler: SubmitHandler<z.infer<typeof taskFormSchema>> = async (
    value
  ) => {
    const taskId = v4();
    let newTask: tasks = {
      id: taskId,
      title: value.title,
      description: value.description,
      workspaceId: workspaceId,
      createdBy: user.id,
      assignedTo: collaborators[0].id,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate: null,
    };

    try {
      const { data, error: createError } = await createTask(newTask);
      if (createError) {
        throw new Error();
      }
      toast({
        title: "success",
        description: "Task created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <ListCheckIcon size={20} />
        Task
      </p>
      <Separator />
      <form action="" onSubmit={handleSubmit(submitHandler)}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-sm text-muted-foreground">
            Title
          </Label>
          <Input
            id="title"
            disabled={isLoading}
            placeholder="Task Title"
            {...register("title", {
              required: "Task title is required",
            })}
          />
          <small className="text-red-500">
            {errors?.title?.message?.toString()}
          </small>
          <Label
            htmlFor="description"
            className="text-sm text-muted-foreground"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Task Description"
            {...register("description", {
              required: "Task description is required",
            })}
          />
          <small className="text-red-500">
            {errors?.description?.message?.toString()}
          </small>
          {/* <Label htmlFor="dueDate" className="text-sm text-muted-foreground">
          Due Date
        </Label>
        <DatePicker /> */}

          <Separator />
          <div className="flex w-full items-center justify-between">
            <Label htmlFor="AssignTo" className="text-sm text-muted-foreground">
              Assign To
            </Label>

            <div className="">
              <CollaboratorSearch
                existingCollaborators={collaborators}
                getCollaborator={(user) => addCollaborator(user)}
                members={true}
              >
                <Button variant={"outline"} className="text-sm" type="button">
                  <PlusCircle />
                </Button>
              </CollaboratorSearch>
            </div>
          </div>
          <Separator />
        </div>

        <Button disabled={isLoading} type="submit">
          {!isLoading ? "Create Task" : <Loader />}
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
