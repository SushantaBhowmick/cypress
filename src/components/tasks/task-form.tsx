"use client";
import { ListCheckIcon, Plus, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CollaboratorSearch from "../global/collaborator-search";
import { tasks, User } from "@/lib/supabase/supabase-types";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { addCollaborators, createTask } from "@/lib/supabase/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema, taskSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { sendMail } from "@/utils/sendMail";

const TaskForm = () => {
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const { state, workspaceId, dispatch } = useAppState();
  const { user, subscription } = useSupabaseUser();
  const { open, setOpen } = useSubscriptionModal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // const form = useForm<z.infer<typeof taskSchema>>({
  //   mode: "onChange",
  //   resolver: zodResolver(taskSchema),
  //   defaultValues: { title: "", description: "", assigned_to:"" },
  // });

  // const isLoading = form.formState.isSubmitting;

  const {toast} = useToast()

  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;

    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(true);
      return;
    }

    await addCollaborators([profile], workspaceId);
    setCollaborators([profile]);
    console.log("collaborators", collaborators);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const uuid = v4();
    if(!workspaceId || !user) return;
    const task:tasks ={
      id:uuid,
      title,
      description,
      assignedTo: collaborators.length >0? collaborators[0]?.id: "",
      workspaceId,
      status:"pending",
      createdBy:user?.id,
      dueDate:new Date().toISOString(),
      createdAt:new Date().toISOString(),
    }
    const {data,error}=await createTask(task);
    if(error){
      toast({
        title:"Error",
        description: "Error creating task",
        variant:'destructive'
      })
    }else{
      toast({
        title:"Success",
        description: "Task created successfully",
      })
      if(!collaborators){
        return;
      }
      const options={
        email:collaborators[0].email!,
        username:collaborators[0].fullName!,
        url:`http://localhost:3000/dashboard/${workspaceId}/tasks`,
        title,
        btnText:"View Task",
        subject:`New Task Assigned`,
      }
      await sendMail(options)
    }
    } catch (error) {
      toast({
        title:"Error",
        description: "Error creating task",
        variant:'destructive'
      })
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <ListCheckIcon size={20} />
        Task
      </p>
      <Separator />
      <form className="flex flex-col gap-2" onSubmit={submitHandler}>
        <Label htmlFor="title" className="text-sm text-muted-foreground">
          Title
        </Label>
        <Input
          name="title"
          placeholder="Task Title"
          required
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
        />
        <Label htmlFor="description" className="text-sm text-muted-foreground">
          Description
        </Label>
        <Textarea
          name="description"
          placeholder="Task Description"
          required
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

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
          {
            collaborators && collaborators.map((item)=>(
              <div key={item.id} className="flex items-center gap-2 p-5 bg-white">
                <p className="text-black">{item.email}</p>
              </div>
            ))
          }
        <Separator />
      <Button type="submit" >Submit</Button>
      </form>
    </div>
  );
};

export default TaskForm;
