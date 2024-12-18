"use client";
import { ListCheckIcon, PlusCircle } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import DatePicker from "./date-picker";
import { Button } from "../ui/button";

const TaskForm = () => {
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

        <Label htmlFor="dueDate" className="text-sm text-muted-foreground">
          Due Date
        </Label>
        <DatePicker />
        
        <Separator />
        <div className="flex items-center justify-between">
        <Label htmlFor="AssignTo" className="text-sm text-muted-foreground">
          Assign To
        </Label>
        <span className=" cursor-pointer">
          <PlusCircle />
        </span>
        </div>
      <Separator />

      </div>

      <Button>Submit</Button>
    </div>
  );
};

export default TaskForm;
