"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CgSelect } from "react-icons/cg";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";

const FormSchema = z.object({
  order_status: z.string({
    required_error: "Please select an order status.",
  }),
});

const EditOrderStatusDialogue = ({ order, refetch }: any) => {
  const [isOpen, setIsOpen] = useState(false); // State for the sheet's open/close status

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      order_status: order?.order_status,
    },
  });

  const editOrderStatus = useMutation({
    mutationFn: (editStatus: any) => {
      return axios.post("/api/order-status-change", editStatus);
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
    },
    onError: () => {
      console.log("order status update failed");
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const orderStatus = { ...data, _id: order._id };

    // same order_status then not hit database
    if (order.order_status !== data.order_status) {
      editOrderStatus.mutate(orderStatus);
    } else {
      console.log("same order status");
    }
  }

  const buttonBg = (status: string) => {
    let bgColor = "";
    switch (status) {
      case "pending":
        bgColor = "bg-lime-600";
        break;
      case "processing":
        bgColor = "bg-teal-700";
        break;
      case "cancelled":
        bgColor = "bg-red-400";
        break;
      case "completed":
        bgColor = "bg-green-500";
        break;
      default:
        bgColor = "#2563eb";
        break;
    }
    return bgColor;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className={`${buttonBg(
            order.order_status
          )} lg:min-w-[140px] text-center`}
        >
          {order.order_status}
          <span className="pl-2">
            <CgSelect />
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Status ?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    name="order_status"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={order?.order_status}
                        >
                          <FormControl>
                            <SelectTrigger className="my-5">
                              <SelectValue placeholder="Select a order Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending </SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between items-end">
                    <Button
                      type="submit"
                      className="!mt-[120px]"
                      disabled={editOrderStatus.isLoading}
                    >
                      {editOrderStatus.isLoading ? "Updating..." : "Update"}
                    </Button>
                    <div>
                      <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                    </div>
                  </div>

                  {/* <Button type="submit" className="!mt-[120px]">
                  Update
                </Button> */}
                </form>
              </Form>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>

    // <Dialog open={isOpen}>
    //   <DialogTrigger asChild>
    //     <Button
    //       className={`${buttonBg(order.order_status)}`}
    //       onClick={() => setIsOpen(true)}
    //     >
    //       {order.order_status}
    //       <span>
    //         <CgSelect />
    //       </span>
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-md">
    //     <DialogHeader>
    //       <DialogTitle>Order Status Change</DialogTitle>
    //     </DialogHeader>
    //     <div className="flex space-x-2 items-end justify-between">
    //       <div className="w-full">
    //         <Form {...form}>
    //           <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="w-full space-y-6"
    //           >
    //             <FormField
    //               name="order_status"
    //               render={({ field }) => (
    //                 <FormItem className="w-full">
    //                   <Select
    //                     onValueChange={field.onChange}
    //                     defaultValue={order?.order_status}
    //                   >
    //                     <FormControl>
    //                       <SelectTrigger className="my-5">
    //                         <SelectValue placeholder="Select a order Status" />
    //                       </SelectTrigger>
    //                     </FormControl>
    //                     <SelectContent>
    //                       <SelectItem value="pending">Pending </SelectItem>
    //                       <SelectItem value="processing">Processing</SelectItem>
    //                       <SelectItem value="cancelled">Cancelled</SelectItem>
    //                       <SelectItem value="completed">Completed</SelectItem>
    //                     </SelectContent>
    //                   </Select>

    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />

    //             <Button
    //               type="submit"
    //               className="!mt-[120px]"
    //               disabled={editOrderStatus.isLoading}
    //             >
    //               {editOrderStatus.isLoading ? "Updating..." : "Update"}
    //             </Button>

    //             {/* <Button type="submit" className="!mt-[120px]">
    //               Update
    //             </Button> */}
    //           </form>
    //         </Form>
    //       </div>
    //       <DialogFooter>
    //         <DialogClose asChild>
    //           <Button
    //             type="button"
    //             variant="secondary"
    //             onClick={() => setIsOpen(false)}
    //           >
    //             Cancel
    //           </Button>
    //         </DialogClose>
    //       </DialogFooter>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  );
};

export default EditOrderStatusDialogue;
