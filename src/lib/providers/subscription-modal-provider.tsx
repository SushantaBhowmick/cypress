"use client";
import SubscriptionModal from "@/components/global/subscription-modal";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProductWirhPrice, Subscription } from "../supabase/supabase-types";
import { AuthUser } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserSubscriptionStatus } from "../supabase/queries";
import { toast } from "@/hooks/use-toast";

type SubscriptionModalContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  subscription: Subscription | null;
  user: AuthUser | null;
};

const SubscriptionModalContext = createContext<SubscriptionModalContextType>({
  open: false,
  setOpen: () => {},
  subscription: null,
  user: null,
});

export const useSubscriptionModal = () => {
  return useContext(SubscriptionModalContext);
};

export const SubscriptionModalProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products:ProductWirhPrice[];
}) => {
  const [open, setOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser=async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }else{
        return
      }
      const { data, error } = await getUserSubscriptionStatus(user?.id);
      if(data) setSubscription(data);
      if (error) {
        toast({
          title: 'Unexpected Error',
          description:
            'Oppse! An unexpected error happened. Try again later.',
        });
      }
    }
    getUser();
  },[supabase,toast])

  return (
    <SubscriptionModalContext.Provider value={{ open, setOpen,user,subscription }}>
      {children}
      <SubscriptionModal products={products} />
    </SubscriptionModalContext.Provider>
  );
};
