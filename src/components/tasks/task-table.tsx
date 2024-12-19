"use client";
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
import { getTasks } from "@/lib/supabase/queries";
import { tasks } from "@/lib/supabase/supabase-types";

const TaskTable = () => {
  const arr = [1, 2, 3, 4, 5];
  const [tasks, setTasks] = useState<tasks[] | []>([]);

  useEffect(() => {
    async function getAllTasks() {
      const { data, error } = await getTasks();
      if (!data) {
        console.log(error);
      } else {
        setTasks(data);
      }
    }
    getAllTasks();
  }, []);

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
          <TableHead className="text-right">Creared By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((item, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.assignedTo}</TableCell>
            <TableCell className="text-right">
              {item.dueDate
                ? item.dueDate.toString().split(" ").slice(0, 4).join(" ")
                : ""}
            </TableCell>
            <TableCell className="text-right">{item.createdBy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
