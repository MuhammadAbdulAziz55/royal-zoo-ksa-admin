"use client";
import Link from "next/link";
import { RxDoubleArrowDown, RxDoubleArrowUp } from "react-icons/rx";
import { Button } from "./ui/button";

import { MdDashboard } from "react-icons/md";

import { usePathname } from "next/navigation";

import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { IoReceiptOutline } from "react-icons/io5";
import { RiAdminLine, RiShoppingCartLine } from "react-icons/ri";

export default function SideBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const lastPath = pathname.split("/").pop();
  return (
    <nav className="p-2 pt-4">
      <ul className="flex flex-col gap-1">
        <li>
          <Button
            variant={lastPath === "" ? "default" : "outline"}
            asChild
            className="justify-start py-4 w-full text-base"
          >
            <Link href="/" className="flex gap-5 items-center">
              <MdDashboard size={20} />
              DashBoard
            </Link>
          </Button>
        </li>
        <li>
          <Button
            variant={lastPath === "products" ? "default" : "outline"}
            asChild
            className="justify-start py-4 w-full text-base"
          >
            <Link href="/products" className="flex gap-5 items-center">
              <RiShoppingCartLine size={20} />
              Products
            </Link>
          </Button>
        </li>
        <li>
          <Button
            variant={lastPath === "orders" ? "default" : "outline"}
            asChild
            className="justify-start py-4 w-full text-base"
          >
            <Link href="/orders" className="flex gap-5 items-center">
              <IoReceiptOutline size={20} />
              Orders
            </Link>
          </Button>
        </li>
        <li>
          <Button
            variant={lastPath === "users" ? "default" : "outline"}
            asChild
            className="justify-start py-4 w-full text-base"
          >
            <Link href="/users" className="flex gap-5 items-center">
              <FiUsers size={20} />
              Users
            </Link>
          </Button>
        </li>
        <li>
          <Button
            variant={lastPath === "admins" ? "default" : "outline"}
            asChild
            className="justify-start py-4 w-full text-base"
          >
            <Link href="/admins" className="flex gap-5 items-center">
              <RiAdminLine size={20} />
              Admins
            </Link>
          </Button>
        </li>
        {/* <li className="group/dropdown relative">
          <Button variant="outline" className=" py-4 w-full ">
            Web Management
          </Button>
          <div className="absolute group-hover/dropdown:block  hidden w-full ">
            <div className="mt-[5px]"></div>
            <ul className="flex flex-col gap-1 ">
              <li>
                <Button
                  variant={
                    lastPath === "legal-information" ? "default" : "outline"
                  }
                  className="py-4 w-full"
                >
                  <Link href="/legal-information"> legal-information</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant={lastPath === "legal-ss" ? "default" : "outline"}
                  className="py-4 w-full"
                >
                  slider
                </Button>
              </li>
              <li>
                <Button
                  variant={lastPath === "legal-ss" ? "default" : "outline"}
                  className="py-4 w-full"
                >
                  footer
                </Button>
              </li>
            </ul>
          </div>
        </li> */}
        <li className="group/dropdown relative">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Web Management
            {isMenuOpen ? (
              <RxDoubleArrowUp className="size-5 pl-1" />
            ) : (
              <RxDoubleArrowDown className="size-5 pl-1" />
            )}
          </Button>
          <div className={`absolute ${isMenuOpen ? "block" : "hidden"} w-full`}>
            <div className="mt-[5px]"></div>
            <ul className="flex flex-col gap-1 ml-2 ">
              <li>
                <Button
                  variant={
                    lastPath === "legal-information" ? "default" : "outline"
                  }
                  className="py-4 w-full justify-start items-center"
                >
                  <Link href="/legal-information"> legal-information</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant={lastPath === "legal-ss" ? "default" : "outline"}
                  className="py-4 w-full justify-start items-center"
                >
                  slider
                </Button>
              </li>
              <li>
                <Button
                  variant={lastPath === "legal-ss" ? "default" : "outline"}
                  className="py-4 w-full justify-start items-center"
                >
                  footer
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
}
