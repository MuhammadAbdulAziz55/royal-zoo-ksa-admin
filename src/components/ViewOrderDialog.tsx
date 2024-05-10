"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TooltipComponent from "./TooltipComponent";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import { fetchOrderDetails } from "@/query_controllers/orderDetails";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const ViewOrderDialog = ({ order }: any) => {
  const [orderData, setCartData] = useState([]);

  const ViwData = async (ordered_products: any) => {
    const data = await fetchOrderDetails(ordered_products);
    setCartData(data.orders);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => ViwData(order.ordered_products)}
          variant="outline"
        >
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[665px]  max-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Table className="capitalize">
            <TableHeader>
              <TableRow>
                <TableHead className="">Images</TableHead>
                <TableHead className="min-w-[120px]">
                  Product Information
                </TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>price</TableHead>
              </TableRow>
            </TableHeader>
            {orderData.length > 0 ? (
              <>
                <TableBody>
                  {orderData &&
                    orderData?.map((order: any) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <div className="relative w-[50px] h-[50px]">
                            <Image
                              src={order.images[0][1] || order.images[0][0]}
                              className="object-contain"
                              fill
                              alt="image not found"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-[270px]	">
                          <div>
                            <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                              <span className="font-bold">Name : </span>
                              <TooltipComponent text={order.name} />
                            </h3>
                            {order.type && (
                              <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                                <span className="font-bold">Type : </span>
                                <TooltipComponent text={order.type} />
                              </h3>
                            )}
                            {order.company_name && (
                              <h3 className="truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
                                <span className="font-bold">
                                  Company Name :{" "}
                                </span>
                                <TooltipComponent text={order.company_name} />
                              </h3>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.product_quantity}</TableCell>
                        <TableCell>{order.price}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="border-2 border-indigo-500 [&>tr:mb-10]">
                  <TableRow>
                    <TableCell colSpan={3}>Product Price</TableCell>
                    <TableCell className="text-right">
                      {order?.total_price - order?.delivery_charge}
                    </TableCell>
                  </TableRow>
                  {/* <Separator /> */}

                  <TableRow>
                    <TableCell colSpan={3}>Delivery Charge</TableCell>
                    <TableCell className="text-right">
                      {order?.delivery_charge}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={3}>Total Price</TableCell>
                    <TableCell className="text-right">
                      {order?.total_price}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </>
            ) : (
              <h1 className="text-center font-bold py-4"> loading </h1>
            )}
          </Table>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
