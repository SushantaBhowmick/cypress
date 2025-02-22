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
import { User } from "@/lib/supabase/supabase-types";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { addCollaborators } from "@/lib/supabase/queries";

const TaskForm = () => {
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const { state, workspaceId, dispatch } = useAppState();
  const { user, subscription } = useSupabaseUser();
  const { open, setOpen } = useSubscriptionModal();

  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;

    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(true);
      return;
    }

    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
  };

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <ListCheckIcon size={20} />
        Task
      </p>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-sm text-muted-foreground">
          Title
        </Label>
        <Input
          name="title"
          placeholder="Task Title"
          //   value={workspaceDetails ? workspaceDetails.title : ""}
          //   onChange={workspaceOnchange}
        />
        <Label htmlFor="description" className="text-sm text-muted-foreground">
          Description
        </Label>
        <Textarea
          name="description"
          placeholder="Task Description"
          //   value={workspaceDetails ? workspaceDetails.title : ""}
          //   onChange={workspaceOnchange}
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
             <Button variant={'outline'} className="text-sm" type="button">
                            <PlusCircle />
                          </Button>
          </CollaboratorSearch>
         </div>
        </div>
        <Separator />
      </div>

      <Button>Submit</Button>
    </div>
  );
};

export default TaskForm;
