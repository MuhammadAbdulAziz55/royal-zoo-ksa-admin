"use client";
import TooltipComponent from "@/components/TooltipComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchUsers } from "@/query_controllers/users";
import { useQuery } from "react-query";

export default function Users() {
  const { data, error, isLoading, refetch } = useQuery(
    ["users", {}],
    fetchUsers
  );

  return (
    <div>
      {isLoading ? (
        <h4 className="mt-6 text-center font-bold"> User is loading </h4>
      ) : !data?.users || data?.users?.length === 0 ? (
        <h4 className="mt-6 text-center font-bold"> data not found </h4>
      ) : (
        <Table className="capitalize">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users &&
              data?.users.map((user: any) => (
                <TableRow key={user?._id}>
                  <TableCell className="font-medium max-w-[180px]">
                    <div>
                      {user.firstName && (
                        <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                          <span className="font-bold">Name : </span>
                          <TooltipComponent
                            text={user?.firstName + " " + user?.lastName}
                          />
                        </h3>
                      )}

                      {user.email && (
                        <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                          <span className="font-bold">Email : </span>
                          <TooltipComponent text={user?.email} />
                        </h3>
                      )}

                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Phone : </span>
                        <TooltipComponent text={user.phoneNumber} />
                      </h3>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[160px]">
                    {user.address ? (
                      <div>
                        <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                          <TooltipComponent text={user.address} />
                        </h3>
                      </div>
                    ) : (
                      <h3> not update</h3>
                    )}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px]">
                    <TooltipComponent
                      text={`${new Date(user.createdAt).toLocaleDateString(
                        "en-US"
                      )}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
