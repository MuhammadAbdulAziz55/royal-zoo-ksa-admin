"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AiFillEdit } from "react-icons/ai";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useMutation } from "react-query";
import { z } from "zod";

const FormSchema = z.object({
  is_SupperAdmin: z.boolean().default(false).optional(),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

const EditAdminUser = ({ admin, activeAdmin, refetch }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: admin?.username,
      is_SupperAdmin: admin?.is_SupperAdmin,
    },
  });

  const editAdmin = useMutation({
    mutationFn: (updateAdminData: any) => {
      return axios.patch("/api/admins", updateAdminData);
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
    },
    onError: () => {
      console.log("order status update failed");
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("edit admin data", data);
    const updateAdmin = { ...data, _id: admin?._id };

    // isSupperAdmin value not change
    // if client site change then reset server site
    if (activeAdmin?.is_SupperAdmin && activeAdmin?._id === admin?._id) {
      updateAdmin.is_SupperAdmin = true;
    }

    // admin change api call
    if (activeAdmin?.is_SupperAdmin) {
      editAdmin.mutate(updateAdmin);
    } else {
      console.log("your are not supper user");
      return;
    }
  }

  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <AiFillEdit size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex justify-between">
            <span>Edit User </span>
            <IoIosCloseCircle
              className="size-8 -mt-3 end-1 absolute z-10 overflow-hidden"
              onClick={() => setIsOpen(false)}
            />
          </SheetTitle>
          <SheetDescription>
            Hi {admin.username} ,update your data.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {activeAdmin?.is_SupperAdmin &&
                    activeAdmin?._id !== admin?._id && (
                      <FormField
                        control={form.control}
                        name="is_SupperAdmin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 py-2">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Supper Admin
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                </div>
              </div>

              <Button type="submit" disabled={editAdmin?.isLoading}>
                {editAdmin.isLoading ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Update</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default EditAdminUser;
