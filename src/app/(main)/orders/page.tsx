"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { FiRefreshCcw } from "react-icons/fi";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// sort by date import
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import TooltipComponent from "@/components/TooltipComponent";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchOrders } from "@/query_controllers/orders";
import formatDateTime from "@/utils/timeFormate";
import { useQuery } from "react-query";

import CPagination from "@/components/Pagination";
import SearchOrders from "@/components/SearchOrder";
import ViewOrderDialog from "@/components/ViewOrderDialog";
import EditOrderStatusDialogue from "../../../components/EditOrderStatusDialogue";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  // pagination
  const page = searchParams?.page || "1";
  const query = searchParams?.query || " ";

  const [sort, setSort] = useState("desc"); // Default sorting is descending
  const [order_status, setOrderStatus] = useState("all");

  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 30);

  const [date, setDate] = useState<DateRange | undefined>({
    from: lastMonth,
    to: lastMonthEnd,
  });

  const serializedDate = JSON.stringify(date);

  const { data, error, isLoading, refetch } = useQuery(
    ["orders", { order_status, sort, date: serializedDate, page, query }],
    fetchOrders
  );

  // multiple filter start

  const handelOrderStatus = (selectOrderStatus: string) => {
    setOrderStatus(selectOrderStatus);
  };

  // Add this function inside your Page component
  const resetFiltersAndRefetch = () => {
    // Reset filters to initial values
    setOrderStatus("all");
    setSort("desc");
    setDate({
      from: lastMonth,
      to: lastMonthEnd,
    });

    // Trigger a refetch of the data
    refetch();
  };

  // order search  start

  // const allOrders = data?.allOrders;
  // const filterOrders = Array.isArray(allOrders)
  //   ? allOrders.filter((order) => {
  //       return (
  //         order.customer_firstName
  //           .toLowerCase()
  //           .includes(query.toLowerCase()) ||
  //         order.customer_phone.toLowerCase().includes(query.toLowerCase())
  //       );
  //     })
  //   : [];

  // console.log("filterOrders", filterOrders);

  // console.log("search ", query);

  // order search end

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col justify-center items-center font-bold h-full">
  //       <h1> orders data is loading</h1>
  //     </div>
  //   );
  // }
  // multiple filter end
  return (
    <div>
      {/* filter order data  */}
      <div className="flex justify-end my-2 gap-x-2 capitalize px-2">
        {/* order search */}
        <SearchOrders />
        {/* sort by date  */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* sort by status  */}
        <Select
          onValueChange={(selectStatus) => handelOrderStatus(selectStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>orders status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* sort by new to old or old to new order   */}
        <Select onValueChange={(selectStatus) => setSort(selectStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Orders Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>orders sort</SelectLabel> */}
              <SelectItem value="date asc">Date(Ascending-Des) </SelectItem>
              <SelectItem value="date desc">Date(Descending-Asc) </SelectItem>
              <SelectItem value="name asc">Name(A-Z)</SelectItem>
              <SelectItem value="name desc">Name(Z-A)</SelectItem>
              <SelectItem value="price asc">Price(Low-High)</SelectItem>
              <SelectItem value="price desc">Price(High-Low)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* refresh filter  */}
        <div
          className="border text-center px-6 flex flex-col justify-center items-center cursor-pointer "
          onClick={resetFiltersAndRefetch}
        >
          <FiRefreshCcw className="active:-rotate-90 " />
        </div>
      </div>
      <Separator />

      {isLoading ? (
        <h4 className="mt-6 text-center font-bold"> Order is loading </h4>
      ) : !data?.orders || data?.orders?.length === 0 ? (
        <h4 className="mt-6 text-center font-bold"> data not found </h4>
      ) : (
        <Table className="capitalize ">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Information</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.orders &&
              data?.orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium max-w-[180px]">
                    <div>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Name : </span>
                        <TooltipComponent
                          text={
                            order.customer_firstName +
                            " " +
                            order.customer_lastName
                          }
                        />
                      </h3>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Email : </span>
                        <TooltipComponent text={order.customer_email} />
                      </h3>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Phone : </span>
                        <TooltipComponent text={order.customer_phone} />
                      </h3>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[160px]">
                    <div>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Area : </span>
                        <TooltipComponent text={order.customer_area} />
                      </h3>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold ">Area-Type : </span>
                        <TooltipComponent text={order.customer_area_type} />
                      </h3>
                      <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Address : </span>
                        <TooltipComponent
                          text={order.customer_shipping_address}
                        />
                      </h3>
                    </div>
                  </TableCell>
                  <TableCell className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[120px]">
                    <TooltipComponent text={order.payment_method} />
                    <br />
                    {order.card_type && (
                      <TooltipComponent text={`${order.card_type}`} />
                    )}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px]">
                    <TooltipComponent
                      text={`${new Date(order.createdAt).toLocaleDateString(
                        "en-US"
                      )}`}
                    />
                    <br />
                    <TooltipComponent
                      text={`${formatDateTime(new Date(order.createdAt))}`}
                    />
                  </TableCell>
                  <TableCell className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <div>
                      <h5 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Price : </span>
                        <TooltipComponent
                          text={`${order.total_price - order.delivery_charge}`}
                        />
                        <span>&#2547;</span>
                      </h5>
                      <h5 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">Charge : </span>
                        <TooltipComponent text={order.delivery_charge} />
                        <span>&#2547;</span>
                      </h5>
                      <h5 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                        <span className="font-bold">T-Price : </span>
                        <TooltipComponent text={order.total_price} />
                        <span>&#2547;</span>
                      </h5>
                    </div>
                  </TableCell>
                  <TableCell className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <EditOrderStatusDialogue order={order} refetch={refetch} />
                  </TableCell>
                  <TableCell className="text-right truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <ViewOrderDialog order={order} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <div className="mb-5 mt-3 overflow-hidden">
        {!isLoading ? (
          !data?.orders || data.orders.length === 0 ? (
            ""
          ) : (
            // <CPagination totalPages={data?.orderCount || 1} />
            <CPagination totalPages={data?.totalPages} />
          )
        ) : (
          ""
        )}

        {/* <CPagination totalPages={totalPages} /> */}

        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page == 1 ? (
                <PaginationPrevious />
              ) : (
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                />
              )}
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {page == totalPages ? (
                <PaginationNext />
              ) : (
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </div>
      <div></div>
    </div>
  );
}
