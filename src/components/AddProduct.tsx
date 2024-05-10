"use client";
import { format } from "date-fns";
import * as React from "react";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { ProductSchema, ProductType } from "@/types";
import { IoIosAddCircleOutline } from "react-icons/io";

// form
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";

const sub_category_Value = [
  "women's care",
  "family planning",
  "baby care",
  "personal care",
  "dental care",
  "men's care",
];
const modifiedProductSchema = z.object({
  // images: ProductSchema.shape.images,
  name: ProductSchema.shape.name
    .min(1, { message: "Name is required!" })
    .regex(/^(?!^\d+$)[\S\s]+$/, {
      message: "only string allow",
    }),
  company_name: ProductSchema.shape.company_name.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  generic_name: ProductSchema.shape.generic_name.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  primary_category: ProductSchema.shape.primary_category.min(1, {
    message: "Primary_category is required!",
  }),
  sub_category: ProductSchema.shape.sub_category
    .min(1, {
      message: "Sub_category is required!",
    })
    .refine(
      (value) => value.every((item) => sub_category_Value.includes(item)),
      { message: "Invalid sub-category" }
    ),
  strength: ProductSchema.shape.strength.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  model: ProductSchema.shape.model.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  price: ProductSchema.shape.price.nonnegative({
    message: "only positive number allow",
  }),
  //.gte(0, { message: "price is required" }),

  quantity: ProductSchema.shape.quantity.refine(
    (value) => value === undefined || (typeof value === "number" && value >= 0),
    {
      message: "only positive number",
    }
  ),
  type: ProductSchema.shape.type.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  size: ProductSchema.shape.size.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  quantity_unit: ProductSchema.shape.quantity_unit.refine(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && /^(?!^\d+$)[\S\s]+$/.test(value)),
    {
      message: "only string allow",
    }
  ),
  stock: ProductSchema.shape.stock.refine(
    (value) => value === undefined || (typeof value === "number" && value >= 0),
    {
      message: "only positive number",
    }
  ),
  discount_amount: ProductSchema.shape.discount_amount.refine(
    (value) => value === undefined || (typeof value === "number" && value >= 0),
    {
      message: "only positive number",
    }
  ),
  discount_percentage: ProductSchema.shape.discount_percentage.refine(
    (value) => value === undefined || (typeof value === "number" && value >= 0),
    {
      message: "only positive number",
    }
  ),
  description: ProductSchema.shape.description,
  code: ProductSchema.shape.code,
  batch_id: ProductSchema.shape.batch_id,
  is_hot_deal: ProductSchema.shape.is_hot_deal,
  is_featured: ProductSchema.shape.is_featured,
  is_daily_deal: ProductSchema.shape.is_daily_deal,
  manufacture_date: ProductSchema.shape.manufacture_date,
  expiration_date: ProductSchema.shape.expiration_date,
});

export default function AddProduct() {
  const form = useForm<ProductType>({
    resolver: zodResolver(modifiedProductSchema),
    defaultValues: {
      name: "",
      primary_category: "",
      sub_category: [""],
      strength: "",
      // price: undefined,
      type: "",
      size: "",
      model: "",
      quantity: 0,
      quantity_unit: "",
      company_name: "",
      generic_name: "",
      discount_amount: 0,
      discount_percentage: 0,
      stock: 0,
      // code: 0,
      batch_id: 0,
      //   manufacture_date: product?.manufacture_date,
      //   expiration_date: product?.expiration_date,
      description: "",
      is_hot_deal: false,
      is_featured: false,
      is_daily_deal: false,
    },
  });
  // submit button loading
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [imagesUrl, setImagesUrl] = React.useState<string[]>([]); // for client site show
  const [selectImage, setSelectImage] = React.useState("");
  const [selectedFiled, setSelectedFiled] = React.useState<File[]>([]); // for database save
  // image set
  function handleImageUpload(event: any) {
    const files = Array.from(event.target.files);
    console.log("files ", files);
    const blobUrls = files.map((file: any) => {
      setSelectedFiled((prevImages) => [...prevImages, file]); // for database
      return URL.createObjectURL(file);
    });
    setImagesUrl((prevImages) => [...prevImages, ...blobUrls]);
    setSelectImage(blobUrls[0]); // upload first image show
  }

  function handleRemoveImage(index: number, event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (imagesUrl[index] === selectImage) {
      setSelectImage(imagesUrl[index - 1]);
    }
    // delete imageUrl
    const newImagesUrl = [...imagesUrl];
    newImagesUrl.splice(index, 1);
    setImagesUrl(newImagesUrl);

    // const selectFile update
    const newSelectFile = [...selectedFiled];
    newSelectFile.splice(index, 1);
    setSelectedFiled(newSelectFile);
  }

  const onSubmit = async (values: ProductType) => {
    const productDetails = {
      ...values,
    };

    // add product api call
    const formData = new FormData();
    // image set
    selectedFiled.forEach((file, index) => {
      formData.append(`images${index}`, file);
    });
    formData.append("otherData", JSON.stringify(productDetails));
    // console.log("formData", formData);

    const res = await axios.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // setButtonLoading(true)
    // console.log("images", imagesUrl);
    // console.log("selectedFiled", selectedFiled);
    console.log("single product update data", values);
  };

  // console.log("Form errors:", form.formState.errors);

  // console.log("manufacture_date", product.manufacture_date);
  const [date, setDate] = React.useState<Date>();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex gap-1 items-center">
          <IoIosAddCircleOutline size={16} />
          Add Product
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto md:!max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="mb-2">Add Product</SheetTitle>
        </SheetHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <div>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            images <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="picture"
                              type="file"
                              multiple
                              accept="image/*"
                              // {...field}
                              onChange={handleImageUpload}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {imagesUrl?.length > 0 && (
                    <div className="gird grid grid-cols-4 gap-4 mt-2">
                      {imagesUrl.map((imageArray, index) => (
                        <div
                          key={index}
                          className={` relative w-12 h-12 rounded  `}
                          onClick={() => setSelectImage(imageArray)}
                        >
                          <button
                            className="absolute top-0 right-0 z-20 text-xs font-medium text-red-500 bg-white rounded-full hover:text-white hover:bg-red-500 p-[2px] px-[6px]"
                            onClick={handleRemoveImage.bind(null, index)}
                          >
                            x
                          </button>
                          <Image
                            src={imageArray}
                            alt="image"
                            fill
                            className="object-cover z-10 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full">
                  {selectImage ? (
                    <div className="w-full max-h-[400px]">
                      <Image
                        src={selectImage}
                        alt="image not show"
                        width={500}
                        height={500}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-h-[400px] text-center flex items-center justify-center">
                      <p>Please select image</p>
                    </div>
                  )}
                </div>
              </div>
              {/* <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      images <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="picture"
                        type="file"
                        // {...field}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          field.onChange([[value]]);
                        }}

                        // defaultValue={getFileNameFromURL(product.images[0][0])}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company_name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company_name"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="generic_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generic_name</FormLabel>
                    <FormControl>
                      <Input placeholder="Generic_name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_category"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>
                      Primary_category<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary_category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non-medicine">
                          non-medicine
                        </SelectItem>
                        <SelectItem value="medicine">medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sub_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      sub_category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sub_category"
                        // list="sub_category"
                        // type="text"
                        // multiple
                        {...field}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          field.onChange(value.split(","));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="strength"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input placeholder="Strength" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Price<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          {...field}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value !== "") {
                              field.onChange(Number(e.target.value));
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quantity"
                          type="number"
                          {...field}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value !== "") {
                              field.onChange(Number(e.target.value));
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="Size" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="quantity_unit"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity_unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Quantity_unit" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Stock"
                          type="number"
                          {...field}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value !== "") {
                              field.onChange(Number(e.target.value));
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="discount_amount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Discount_amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Discount_amount"
                          type="number"
                          {...field}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value !== "") {
                              field.onChange(Number(e.target.value));
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Discount_percentage</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Discount_percentage"
                          type="number"
                          {...field}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            if (value !== "") {
                              field.onChange(Number(e.target.value));
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex gap-x-2 justify-between">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code"
                          {...field}
                          onChange={(e: any) => {
                            // Parse the input value to a number and update the field value
                            const value = e.target.value;
                            field.onChange(Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batch_id"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Batch_id</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Batch_id"
                          {...field}
                          onChange={(e: any) => {
                            // Parse the input value to a number and update the field value
                            const value = e.target.value;
                            if (/^\d+(\.\d+)?$/.test(value)) {
                              field.onChange(Number(value));
                            } else {
                              field.onChange(Number("0"));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex gap-x-1 justify-between">
                <FormField
                  control={form.control}
                  name="is_hot_deal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is_hot_deal</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>is_featured</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_daily_deal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>is_daily_deal</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex gap-x-1 justify-between">
                <FormField
                  control={form.control}
                  name="manufacture_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Manufacture_date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>manufacture_date date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>expiration_date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>expiration_date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> */}
                Submit
              </Button>
            </form>
          </Form>

          {/* <p>{product.name}</p> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
