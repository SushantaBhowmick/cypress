import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TaskTable = () => {
  const arr = [1, 2, 3, 4, 5];

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
          {arr.map((item,i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{i+1}</TableCell>
              <TableCell>
                This is the task title that you have asisigned by someone
              </TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Sushanta Bhowmick</TableCell>
              <TableCell className="text-right">25/5/25</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default TaskTable;
