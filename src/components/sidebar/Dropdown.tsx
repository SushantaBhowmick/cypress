"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emoji-Picker";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId,folderId } = useAppState();
  const [isEdititng, setIsEditing] = useState(false);
  const router = useRouter();


  //foldertitlesynced server data and local data

  //fileTitile

  //Navigate the user to a different page
  const navigationPage =(accordianId:string,type:string)=>{
    if(type==='folder'){
        router.push(`/dashboard/${workspaceId}/${accordianId}`)
    }
    if(type==='file'){
        router.push(`/dashboard/${workspaceId}/${folderId}/${accordianId}`)
    }
  }

  //add a file

  //fouble click handler

  //blur

  //onchanges
  //move to trash

  const isFolder = listType === "folder";

  const listStyles = useMemo(() =>
    clsx("relative", {
      "border-none text-md": isFolder,
      "border-none ml-6 text-[16px] py-1": !isFolder,
    }),[isFolder]
  );

  const groupIdentify=clsx(
    'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
    {
        'group/folder':isFolder,
        'group/file':!isFolder
    }
  )

  return <AccordionItem 
  value={id} 
  className={listStyles} 
  onClick={(e)=>{
    e.stopPropagation();
    navigationPage(id,listType)
  }}>
    <AccordionTrigger id={listType}
     className="hover:no-underline 
     p-2 
     dark:text-muted-foreground 
     text-sm"
     disabled={listType === 'file'}
    >
        <div className={groupIdentify}>
            <div className="flex gap-4 items-center justify-center overflow-hidden">
                <div className="relative">
                    {/* <EmojiPicker getValue={}/> */}{"time:5.21.59h"}
                </div>
            </div>
        </div>
    </AccordionTrigger>
  </AccordionItem>;
};

export default Dropdown;
