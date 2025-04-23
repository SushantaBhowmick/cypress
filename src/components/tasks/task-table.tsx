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
import { useAppState } from "@/lib/providers/state-provider";
import { getTaskByWorkspaceId } from "@/lib/supabase/queries";
import { useToast } from "@/hooks/use-toast";
import { tasks } from "@/lib/supabase/supabase-types";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

interface TaskProps extends tasks {
  collaborator: any;
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

  useEffect(() => {
    const fetchTasks = async () => {
      if (!workspaceId) return;
      const { data, error } = await getTaskByWorkspaceId(workspaceId);
      if (data?.length) setTaskArr(data);
      if (error) {
        toast({
          title: "Error",
          description: "Error while fetching tasks",
        });
      }
    };
    fetchTasks();
  }, []);

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...taskArr];
    updated[index].title = newTitle;
    setTaskArr(updated);
    // Optionally call API here to save
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...taskArr];
    updated[index].status = newStatus;
    setTaskArr(updated);
    // Optionally call API here to save
  };

  const handleDateChange = (index: number, date: Date) => {
    const updated = [...taskArr];
    updated[index].dueDate = date.toString(); // assumes your schema supports Date
    setTaskArr(updated);
    // Optionally call API here to save
  };

  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  return (
    <Table>
      <TableCaption>A list of your recent workspace tasks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Sl</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned to</TableHead>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      color="secondary"
                      variant="ghost"
                      className="cursor-pointer p-0"
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
                    ].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(i, status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{item.collaborator?.user?.email}</TableCell>
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
