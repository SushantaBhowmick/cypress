"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppState } from "@/lib/providers/state-provider";
import {
  getCollaboratorsByWorkspaceId,
  getTaskByWorkspaceId,
  updateTask,
} from "@/lib/supabase/queries";
import { useToast } from "@/hooks/use-toast";
import { collaborators, tasks, User } from "@/lib/supabase/supabase-types";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useLoader } from "@/lib/providers/loader-provider";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

interface TaskProps extends tasks {
  collaborator: any;
}

interface CollaboratorsProps extends collaborators {
  user: User;
}

type Checked = DropdownMenuCheckboxItemProps["checked"];

const statusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "in development": "bg-blue-100 text-blue-800 border-blue-300",
  waiting: "bg-gray-100 text-gray-800 border-gray-300",
  "in qa": "bg-purple-100 text-purple-800 border-purple-300",
  "in review": "bg-orange-100 text-orange-800 border-orange-300",
  closed: "bg-green-100 text-green-800 border-green-300",
};

const TaskTable = () => {
  const { workspaceId } = useAppState();
  const [taskArr, setTaskArr] = useState<TaskProps[] | []>([]);
  const { toast } = useToast();
  const { setLoading } = useLoader();
  const [collaborators, setCollaborators] = useState<CollaboratorsProps[]>([]);

  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const debounceDateRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...taskArr];
    updated[index].title = newTitle;
    const taskId = updated[index].id;
    setTaskArr(updated);

    // clear the existing timeout for this task
    if (debounceRef.current[taskId]) {
      clearTimeout(debounceRef.current[taskId]);
    }

    //set a new debounce timer
    debounceRef.current[taskId] = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await updateTask({ title: newTitle }, taskId);
      if (data) {
        setLoading(false);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
      if (error) {
        setLoading(false);
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to update title",
        });
      }
    }, 1000);
  };

  const handleStatusChange = async (index: number, newStatus: string) => {
    setLoading(true);
    const updated = [...taskArr];
    const prevStatus = updated[index].status;
    updated[index].status = newStatus;
    setTaskArr(updated);
    let task = {
      status: newStatus,
    };

    const { data, error } = await updateTask(task, updated[index].id);

    if (data) {
      setLoading(false);
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
    }
    if (error) {
      setLoading(false);
      updated[index].status = prevStatus;
      setTaskArr([...updated]);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update status",
      });
    }
  };

  const handleDateChange = (index: number, date: Date) => {
    const updated = [...taskArr];
    updated[index].dueDate = date.toString(); // assumes your schema supports Date
    setTaskArr(updated);
    const taskId = updated[index].id;

    // clear the existing timeout for this task
    if (debounceDateRef.current[taskId]) {
      clearTimeout(debounceDateRef.current[taskId]);
    }

    // set a new debounce timer
    debounceDateRef.current[taskId] = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await updateTask(
        { dueDate: date.toString() },
        taskId
      );

      if (data) {
        setLoading(false);
        toast({
          title: "Success",
          description: "Due date updated successfully",
        });
      }
      if (error) {
        setLoading(false);
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to update due date",
        });
      }
    }, 500);
  };

  const handleAssignToChange=async(index:number,col:CollaboratorsProps)=>{
    setLoading(true);
    const updated = [...taskArr];
    updated[index].assignedTo = col.id;
    updated[index].collaborator.user.email = col.user.email;
    const taskId = updated[index].id;
    const prevAssignedTo = updated[index].assignedTo;
    setTaskArr(updated);
    const {data,error} = await updateTask({assignedTo:col.id},taskId)
    if(data){
      setLoading(false)
      toast({
        title: "Success",
        description: "Assigned to updated successfully",
      });
    }
    if(error){
      updated[index].assignedTo = prevAssignedTo;
      updated[index].collaborator.user.email = col.user.email;
      setTaskArr(updated);        
      setLoading(false)
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to assigned",
      });
    }

  }

  useEffect(() => {

    const fetchTasks = async () => {
      if (!workspaceId) return;
      setLoading(true);
  
      try {
        const { data, error } = await getTaskByWorkspaceId(workspaceId);
  
        if (error) {
          toast({
            title: "Error",
            description: "Error while fetching tasks",
          });
        }
  
        if (data) {
          setTaskArr(data);
        }
  
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Unexpected error while fetching tasks",
        });
      } finally {
        setLoading(false); // always called
      }
    };
  
    const fetchCollaborators = async () => {
      if (!workspaceId) return;
  
      // setLoading(true);
      const { data, error } = await getCollaboratorsByWorkspaceId(workspaceId);
      if (data?.length) {
        setCollaborators(data as CollaboratorsProps[]);
        // setLoading(false);
      }
      if (error) {
        // setLoading(false);
        toast({
          title: "Error",
          description: "Error while fetching collaborators",
        });
      }
    };

    fetchCollaborators();
    fetchTasks();

    // Cleanup function to clear any pending timeouts
    return () => {
      Object.values(debounceRef.current).forEach(clearTimeout);
      Object.values(debounceDateRef.current).forEach(clearTimeout);
    };
  }, [workspaceId, toast]);

 

  return (
    <Table>
      <TableCaption>A list of your recent workspace tasks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Sl</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Assigned to</TableHead>
          <TableHead className="text-right">Due Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {taskArr &&
          taskArr.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <Input
                  value={item.title}
                  onChange={(e) => handleTitleChange(i, e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      color="secondary"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className={`cursor-pointer border ${statusColorMap[item.status] || ""}`}
                      >
                        {item.status}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "pending",
                      "in development",
                      "waiting",
                      "in qa",
                      "in review",
                      "closed",
                    ].map((status, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => handleStatusChange(i, status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      color="secondary"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      {item.collaborator?.user?.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-76 h-56">
                    <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {collaborators &&
                      collaborators.map((col, index) => (
                        <div
                          key={col.id}
                        >
                          <DropdownMenuCheckboxItem
                          className="cursor-pointer py-4"
                          checked={col.id===item.assignedTo}
                          onClick={()=>handleAssignToChange(i,col)}
                        >
                          {col.user.email ?? col.user.fullName}
                        </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                        </div>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-muted-foreground border rounded px-2 py-1">
                      {item.dueDate
                        ? format(new Date(item.dueDate), "dd/MM/yyyy")
                        : "Pick a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={
                        item.dueDate ? new Date(item.dueDate) : undefined
                      }
                      onSelect={(date) => date && handleDateChange(i, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`tasks/${item.id}`}>View</Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
