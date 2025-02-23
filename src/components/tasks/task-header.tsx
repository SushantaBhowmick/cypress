
import React from "react";
import TitleSection from "../landing-page/title-section";
import { Button } from "../ui/button";
import { useAppState } from "@/lib/providers/state-provider";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { Filter, ListCheck, Plus, PlusCircle, PlusIcon } from "lucide-react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import TaskForm from "./task-form";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AddTaskTrigger from "./add-task-Trigger";


const TaskHeader = async ({ params }: { params: { workspaceId: string } }) => {
  const workspaceId = params?.workspaceId;
  const { data, error } = await getWorkspaceDetails(workspaceId);
  const supabase = createServerComponentClient({ cookies });

  const {data:{user}} = await supabase.auth.getUser();

  if (!user && !data) return;

  const showToast=()=>{

  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className=" border-[5px] mb-1 border-primary-purple-400 w-full text-center">
        <h1 className="text-[20px] font-bold py-2">Task List</h1>
      </div>
      <div className="p-2 border-[2px] border-gray-300 w-full flex justify-between items-center">
        <div className="flex gap-2">
          <div className=" cursor-pointer flex gap-2 items-center text-white bg-gray-600 rounded-md p-2">
            <span>{data[0].iconId}</span>
            <h1 className="text-[18px]">{data[0].title}</h1>
          </div>

          <div className=" cursor-pointer flex gap-2 items-center text-white bg-gray-600 rounded-md p-2">
            <span>
              <Filter />
            </span>
            <h1 className="text-[18px]">Assign</h1>
          </div>

          <div className=" cursor-pointer flex gap-2 items-center text-white bg-gray-600 rounded-md p-2">
            <span>
              <ListCheck />
            </span>
            <h1 className="text-[18px]">Tasks</h1>
          </div>
        </div>
       <AddTaskTrigger userId={user?.id} workspaceOwnerId={data[0].workspaceOwner}/>
      </div>
    </div>
  );
};

export default TaskHeader;
