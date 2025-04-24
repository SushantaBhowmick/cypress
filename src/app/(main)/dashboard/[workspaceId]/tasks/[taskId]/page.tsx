'use client'
import { getTaskDetails } from '@/lib/supabase/queries';
import { collaborators, tasks, User } from '@/lib/supabase/supabase-types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLoader } from '@/lib/providers/loader-provider';

interface Collaborator extends collaborators {
    user:User
}

interface Task extends tasks{
    collaborators:Collaborator;
    createdByUser:User;
}

const TaskDetailsPage = () => {
    const params = useParams();
    const taskId = params?.taskId;
    const [task,setTask]=useState<Task | null>(null);
    const {setLoading} = useLoader()

    useEffect(()=>{
        async function fetchDetails(){
            if(!taskId) return;
            setLoading(true)
            const taskDetails = await getTaskDetails(taskId.toString())
            if(taskDetails){
                setTask(taskDetails as Task)
                setLoading(false)
            }else{
                setLoading(false)
                console.log("not done")
            }
        }
        fetchDetails()
    },[taskId])

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
    <Card className="shadow-xl rounded-2xl">
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{task?.title}</h1>
          <Badge
            variant={
              task?.status === "completed"
                ? "default"
                : task?.status === "in_progress"
                ? "secondary"
                : "destructive"
            }
          >
            {task?.status.replaceAll("_", " ")}
          </Badge>
        </div>

        {task?.description && <p className="text-muted-foreground">{task.description}</p>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Assigned To</p>
            <p>{task?.collaborators.user.email}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Created By</p>
            <p>{task?.createdByUser.email}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Due Date</p>
            <p>{task?.dueDate ? format(new Date(task?.dueDate), "PPPp") : "No due date"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Created At</p>
            <p>{task?.createdAt && format(new Date(task?.createdAt), "PPPp")}</p>
          </div>
        </div>

        <div className="pt-4">
          <Button>Edit Task</Button>
        </div>
      </CardContent>
    </Card>
  </div>

)
}

export default TaskDetailsPage;

{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
<div className="md:col-span-2 space-y-6">
  <div>
    <h1 className="text-3xl font-semibold mb-2">{task?.title}</h1>
    <Badge variant="outline" className="capitalize">{task?.status}</Badge>
  </div>

  <div>
    <h2 className="text-lg font-medium mb-1">Description</h2>
    <p className="text-muted-foreground whitespace-pre-line">
      {task?.description || "No description provided."}
    </p>
  </div>

  <Separator />

  <div className="text-sm text-muted-foreground space-y-1">
    <p>
      <span className="font-medium text-black">Due Date:</span>{" "}
      {task?.dueDate ? new Date(task.dueDate).toLocaleString() : "Not set"}
    </p>
    <p>
      <span className="font-medium text-black">Created At:</span>{" "}
      {task?.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown"}
    </p>
  </div>
</div>

    <div className="space-y-6">
  <div>
    <h2 className="text-lg font-medium mb-2">Assignee</h2>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>
          {task?.collaborators?.user?.fullName?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {task?.collaborators?.user?.fullName || "Unnamed User"}
        </p>
        <p className="text-sm text-muted-foreground">
          {task?.collaborators?.workspaceRole}
        </p>
      </div>
    </div>
  </div>

  <Separator />

  <div>
    <h2 className="text-lg font-medium mb-2">Created By</h2>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>
          {task?.createdByUser?.fullName?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {task?.createdByUser?.fullName || task?.createdByUser?.email}
        </p>
        <p className="text-sm text-muted-foreground">
          {task?.createdByUser?.email}
        </p>
      </div>
    </div>
  </div>
</div>
</div> */}

{/* <div className="p-6 space-y-6">
<Card>
  <CardHeader>
    <CardTitle className="text-2xl">{task?.title}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-muted-foreground">{task?.description}</p>
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="capitalize">{task?.status}</Badge>
      <span className="text-sm text-gray-500">Due: {new Date(task?.dueDate).toLocaleString()}</span>
      <span className="text-sm text-gray-500">Created: {new Date(task?.createdAt).toLocaleString()}</span>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Assigned To</CardTitle>
  </CardHeader>
  <CardContent className="flex items-center gap-4">
    <Avatar>
      <AvatarFallback>{task?.collaborators?.user?.fullName?.[0] ?? "?"}</AvatarFallback>
    </Avatar>
    <div>
      <p>{task?.collaborators?.user?.fullName || "Unnamed User"}</p>
      <p className="text-sm text-muted-foreground">
        Role: {task?.collaborators.workspaceRole}
      </p>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Created By</CardTitle>
  </CardHeader>
  <CardContent className="flex items-center gap-4">
    <Avatar>
      <AvatarFallback>{task?.createdByUser?.fullName?.[0] ?? "?"}</AvatarFallback>
    </Avatar>
    <div>
      <p>{task?.createdByUser?.fullName || task?.createdByUser.email}</p>
      <p className="text-sm text-muted-foreground">
        Email: {task?.createdByUser.email}
      </p>
    </div>
  </CardContent>
</Card>
</div> */}
