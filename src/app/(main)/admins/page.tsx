"use client";

import AddAdminUser from "@/components/AddAdminUser";
import DeleteAdminUser from "@/components/DeleteAdminUser";
import EditAdminUser from "@/components/EditAdminUserSheet";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

interface ActiveAdmin {
  _id: string;
  username: string;
  password: string;
  is_SupperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export default function AdminUser() {
  let activeAdmin: ActiveAdmin | null = null;
  const { data: session } = useSession();

  // console.log("session data client site ", session?.user);

  // allAdmin and ActiveAdmin query
  // session.user username and id is unique

  const { isLoading, data, refetch } = useQuery("userAdmin", async () => {
    const response = await axios.get(`/api/admins`);
    return response.data;
  });

  if (!isLoading) {
    activeAdmin = data.admins.find(
      (admin: any) => admin._id === (session?.user as any)?.id
    );
    // setActiveAdmin(active);
    // console.log("avtive usersss", activeAdmin);
  }

  return (
    <div>
      <div className="flex  justify-between my-3 mx-2 items-end">
        {/* <div> Hi {session ? <span>{session?.user?.name} </span> : ""} </div> */}
        <div>Hi {activeAdmin ? <span>{activeAdmin.username} </span> : ""} </div>
        <div className="max-w-[120px]">
          <AddAdminUser refetch={refetch} />
        </div>
      </div>
      <Separator />

      <div>
        {isLoading ? (
          <h4 className="mt-6 text-center font-bold"> admin is loading </h4>
        ) : !data?.admins || data?.admins?.length === 0 ? (
          <h1>admin data not found</h1>
        ) : (
          <Table className="capitalize table-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Username</TableHead>
                <TableHead className="w-[25%]">createdAt</TableHead>
                <TableHead className="w-[25%]">updatedAt</TableHead>
                <TableHead className="w-[25%]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.admins.map((admin: any) => (
                <TableRow key={admin._id}>
                  <TableCell className="font-medium ">
                    {admin.username}
                  </TableCell>
                  <TableCell className="font-medium ">
                    {new Date(admin.createdAt).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell className="font-medium ">
                    {new Date(admin.createdAt).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell className="font-medium ">
                    <div className="flex gap-x-2">
                      {activeAdmin?.is_SupperAdmin && (
                        <EditAdminUser
                          admin={admin}
                          activeAdmin={activeAdmin}
                          refetch={refetch}
                        />
                      )}
                      {/* <EditAdminUser admin={admin} /> */}
                      <DeleteAdminUser
                        admin={admin}
                        activeAdmin={activeAdmin}
                        // activeAdmin={session?.user}
                        refetch={refetch}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
