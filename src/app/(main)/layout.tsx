"use client";
import { ModeToggle } from "@/components/ModeToggle";
import SideBar from "@/components/SideBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "next-auth/react";
import userAvater from "/public/avater.png";
import { FaSignOutAlt } from "react-icons/fa";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden flex-col min-h-screen">
      <header className="flex justify-between items-center py-4 px-8 border-b ">
        <h1 className="text-2xl font-bold">Aamar Pharma</h1>

        <div className="flex gap-3 justify-center items-center">
          <ModeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Avatar>
                <AvatarImage src={`${userAvater}`} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="">
                <a
                  className="cursor-pointer flex items-center gap-x-1"
                  onClick={() => signOut()}
                >
                  <span>
                    <FaSignOutAlt />
                  </span>
                  <span> Sign out </span>
                </a>
              </div>
            </PopoverContent>
          </Popover>

          {/* <div className="w-10 h-10 bg-gray-500 rounded-full"></div> */}
        </div>
      </header>
      <div className="flex overflow-auto flex-grow">
        <aside className="basis-[15%] overflow-auto border-r ">
          <SideBar />
        </aside>
        <main className="overflow-auto basis-[85%]">{children}</main>
      </div>
    </div>
  );
}
