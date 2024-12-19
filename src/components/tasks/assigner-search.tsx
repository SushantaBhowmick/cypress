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
} from "../ui/sheet";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getCollaboratorsFromSearch } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";

interface AssignerSearchProps {
  existingCollaborators: User[] | [];
  getCollaborator: (collaborator: User) => void;
  children: React.ReactNode;
}

interface AssignUserProps {
  id: string;
  email: string;
  userId: string;
  workspaceId: string;
}

const AssignerSearch: React.FC<AssignerSearchProps> = ({
  getCollaborator,
  children,
  existingCollaborators,
}) => {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<User[] | []>(
    []
  );
  const timeRef = useRef<ReturnType<typeof setTimeout>>();
  const { workspaceId } = useAppState();

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  }, []);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(async () => {
      if (!workspaceId) return;
      const res = await getCollaboratorsFromSearch(e.target.value, workspaceId);
      const mappedResults = res.map((item) => ({
        id: item.id,
        fullName: null, // Default value if not available in `item`
        avatarUrl: null, // Default value if not available in `item`
        billingAddress: null, // Add any defaults as needed
        updatedAt: null, // Default if unavailable
        paymentMethod: null, // Default if unavailable
        email: item.email, // Map the existing field
      }));
      setSearchResults(mappedResults);
    }, 500);
  };
  const addCollaborator = (user: User) => {
   getCollaborator(user);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Search Collaborators</SheetTitle>
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
          {searchResults.length !==0?(
            searchResults
            .filter(
              (res) =>
                !existingCollaborators.some(
                  (existing) => existing.id === res.id
                )
            )
            .filter((item) => item.id !== user?.id)
            .map((usr, i) => (
              <div key={i} className="p-4 flex justify-center items-center">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src="/avatars/7.png"></AvatarImage>
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                    {usr.email}
                  </div>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={() => addCollaborator(usr)}
                >
                  Add
                </Button>
              </div>
            ))
          ):(
            <span className="flex justify-center text-sm text-muted-foreground w-full text-center">
                No collaborators found!
            </span>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AssignerSearch;
