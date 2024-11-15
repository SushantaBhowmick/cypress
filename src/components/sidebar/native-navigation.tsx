import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import CypressHomeIcon from "../icons/cypressHomeIcon";
import CypressSettingsIcon from "../icons/cypressSettingsIcon";
import CypressTrashIcon from "../icons/cypressTrashIcon";

interface NativeNavigationProps {
  myWorkspaceId: string;
  className?: string;
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
}) => {
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className=" gap-2 items-center group/native flex transition-all text-Neutrals/neutrals-7"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>
        <li>
          <Link
            className=" gap-2 items-center group/native flex transition-all text-Neutrals/neutrals-7"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressSettingsIcon />
            <span>Settings</span>
          </Link>
        </li>
        <li>
          <Link
            className=" gap-2 group/native flex transition-all text-Neutrals/neutrals-7 items-center "
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressTrashIcon />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NativeNavigation;
