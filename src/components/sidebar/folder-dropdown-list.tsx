"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Folder } from "@/lib/supabase/supabase-types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import TooltipComponent from "../global/tooltip";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { createFolder } from "@/lib/supabase/queries";
import { Accordion } from "../ui/accordion";
import Dropdown from "./Dropdown";
import useSupabaseRealtime from "@/lib/hooks/useSupabaseRealtime";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";

interface FoldersDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  //local state folders
  useSupabaseRealtime();
  const { state, dispatch, folderId } = useAppState();
  const [folders, setFolders] = useState(workspaceFolders);
  const {subscription} = useSupabaseUser();
  const {open,setOpen} =useSubscriptionModal()
  const {toast} = useToast();

  // effect set initial state server app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId, dispatch]);

  // state
  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [state]);

  // add folder
  const addFolderHandler=async()=>{
    if(folders.length>=3 && !subscription){
      setOpen(true);
      return;
    }

    const newFolder:Folder={
      data:null,
      id:v4(),
      createdAt:new Date().toISOString(),
      title:'Untitled',
      iconId:'📄',
      inTrash:null,
      workspaceId,
      bannerUrl:''
    }

    dispatch({type:'ADD_FOLDER',
      payload:{workspaceId,folder:{...newFolder,files:[]}}
    });

    const {data,error}=await createFolder(newFolder);

    if(error){
      toast({title:'Error',
          variant:'destructive',
          description:'Could not create the folder'
      });
    }else{
      toast({
        title:'Success',
        description:'Created folder.'
      })
    }
  }

  return (
    <>
    <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
      <span className="font-bold text-xs text-Neutrals/neutrals-8">
        FOLDERS
      </span>
      <TooltipComponent message="Create Folder">
        <PlusIcon
        onClick={addFolderHandler}
          size={16}
          className="group-hover/title:inline-block hidden cursor-pointer hover:dark:text-white"
        />
      </TooltipComponent>
    </div>
      <Accordion
      type="multiple"
      defaultValue={[folderId || '']}
      className=" pb-20"
      >
        {
          folders.filter((folder)=>!folder.inTrash)
          .map((f)=>(

            <Dropdown 
            key={f.id}
            title={f.title}
            listType="folder"
            id={f.id}
            iconId={f.iconId}
            />
          ))
        }
      </Accordion>
    </>
  );
};

export default FoldersDropdownList;
