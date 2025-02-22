"use client";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User } from "@/lib/supabase/supabase-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getMembersFromSearch, getUsersFromSearch } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";

interface CollaboratorSearchProps {
  existingCollaborators: User[] | [];
  getCollaborator: (collaborator: User) => void;
  children: React.ReactNode;
  members?:boolean;
}

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  children,
  existingCollaborators,
  getCollaborator,
  members
}) => {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<User[] | []>([]);
  const timeRef = useRef<ReturnType<typeof setTimeout>>();
  const {workspaceId} = useAppState();

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  }, []);

  if(!workspaceId) return;

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
   try {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(async () => {
     if(members){
      const res = await getMembersFromSearch(e.target.value,workspaceId);
      setSearchResults(res);
     }else{
      const res = await getUsersFromSearch(e.target.value);
      setSearchResults(res);
     }
    }, 500);
   } catch (error) {
    console.log(error)
   }
  };
  const addCollaborator = (user: User) => {
    getCollaborator(user);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Search Collaborator</SheetTitle>
          <SheetDescription>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them settings tab
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Search />
          <Input
            placeholder="Email"
            className="dark:bg-background"
            onChange={onChangeHandler}
          />
        </div>
        <ScrollArea className="mt-6 overflow-y-auto w-full rounded-md">
          {searchResults
            .filter(
              (result) =>
                !existingCollaborators.some(
                  (existing) => existing.id === result.id
                )
            )
            .filter((item) => item.id !== user?.id)
            .map((user, i) => (
              <div key={i} className="p-4 flex justify-center items-center">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src="/avatars/7.png"></AvatarImage>
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={() => addCollaborator(user)}
                >
                  Add
                </Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CollaboratorSearch;
