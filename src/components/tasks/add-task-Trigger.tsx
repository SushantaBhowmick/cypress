"use client";
import React from "react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import TaskForm from "./task-form";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

interface AddTaskTriggerProps {
  userId?: string;
  workspaceOwnerId: string;
}

const AddTaskTrigger: React.FC<AddTaskTriggerProps> = ({
  userId,
  workspaceOwnerId,
}) => {
  const {toast} = useToast();
    const showToast = () => {
        toast({
            title: 'Permission Denied',
            variant:'destructive',
            description: 'You do not have permission to add task',
        })
        // status: 'error',
        // duration: 5000,
        // isClosable: true,
    };
  return (
    <div>
      {userId === workspaceOwnerId ? (
        <CustomDialogTrigger
          header="Add Task"
          description=""
          content={<TaskForm />}
        >
          <div className=" cursor-pointer flex gap-1 items-center text-white bg-primary-purple-400 rounded-md p-2">
            <span>
              <Plus />
            </span>
            <span className="text-[18px]">Add Task</span>
          </div>
        </CustomDialogTrigger>
      ) : (
        <Button onClick={showToast}>Add Task</Button>
      )}
    </div>
  );
};

export default AddTaskTrigger;
