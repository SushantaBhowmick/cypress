"use client"
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import CypressProfileIcon from '../icons/cypressProfileIcon'
import { Subscription, User } from '@/lib/supabase/supabase-types';
import { useAppState } from '@/lib/providers/state-provider';

interface UserCardToggleProps {
    subscription: Subscription | null;
    profile:User
}

const UserCardToggle:React.FC<UserCardToggleProps> = ({subscription,profile}) => {

    const {workspaceId} = useAppState();

  return (
    <div>
      <aside className="flex justify-center items-center gap-2">
            <Link href={`${workspaceId}/profile`} className="flex items-center gap-2">
            <Avatar className="cursor-pointer">
                <AvatarImage src={profile.avatarUrl || ''}/>
                <AvatarFallback>
                    <CypressProfileIcon />
                </AvatarFallback>
            </Avatar></Link>
            <div className="flex flex-col">
                <span className="text-muted-foreground">
                    {subscription?.status==='active'?'Pro Plan' : 'Free Plan'}
                </span>
                <small className="w-[100px] overflow-hidden overflow-ellipsis">
                    {profile.email}
                </small>
            </div>
        </aside>
    </div>
  )
}

export default UserCardToggle
