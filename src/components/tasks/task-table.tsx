'use client'
import React, { useEffect, useState } from "react";
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
import { tasks } from "@/lib/supabase/schema";
import { getTaskByWorkspaceId } from "@/lib/supabase/queries";
import { useToast } from "@/hooks/use-toast";

const TaskTable = () => {
    const { workspaceId } = useAppState();
    const [taskArr,setTaskArr]=useState<typeof tasks[]>([])
    const {toast} = useToast()

    useEffect(()=>{
      const fetchTasks=async()=>{
        if(!workspaceId) return;
        const {data,error}= await getTaskByWorkspaceId(workspaceId)
        if(data){
          setTaskArr(data)
        }
        if(error){
          toast({
            title:"Error",
            description:"error wile fething tasks"
          })
        }

      }
      fetchTasks()
    },[])
  

  return (
      <Table>
        <TableCaption>A list of your recent workspace tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead className="text-right">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskArr&& taskArr.map((item,i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{i+1}</TableCell>
              <TableCell>
                {item?.title}
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.collaborator.user.email}</TableCell>
              <TableCell className="text-right">25/5/25</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default TaskTable;
