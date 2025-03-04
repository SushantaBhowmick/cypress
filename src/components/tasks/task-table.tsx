'use client'
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tasks } from "@/lib/supabase/supabase-types";
// import { getAllTasks } from "@/lib/supabase/queries";
// import {useQuery} from '@tanstack/react-query'

const TaskTable = () => {
const [tasks,setTasks] = useState<tasks[]>([])
  // const {data:tasks,isLoading,isError}= useQuery({
  //   queryKey:['tasks'],
  //   queryFn:getAllTasks,
  //   staleTime:5000,
  // })



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
          {tasks && tasks.map((item,i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{i+1}</TableCell>
              <TableCell>
                {item.title}
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.assignedTo}</TableCell>
              <TableCell className="text-right">{item.dueDate?.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default TaskTable;
