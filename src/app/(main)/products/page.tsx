"use client";

import { useQuery } from "react-query";

import { fetchProducts } from "@/query_controllers/product";

import { Separator } from "@/components/ui/separator";

import axios from "axios";

import { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { ProductType } from "@/types";
import Image from "next/image";

import EditProductSheet from "@/components/EditProductSheet";

import DeleteAlertDialogue from "@/components/DeleteAlertDialogue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AddProduct from "@/components/AddProduct";
import CPagination from "@/components/Pagination";
import SearchOrders from "@/components/SearchOrder";

const sub_categories = [
  "women's care",
  "family planning",
  "baby care",
  "personal care",
  "dental care",
  "men's care",
];

export default function Products({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const page = searchParams?.page || "1";
  const search = searchParams?.query || "";

  const [primaryCategory, setPrimaryCategoryFilter] = useState("");
  const [subCategory, setSubCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date desc");
  const [isEnableDisable, setIsEnableDisable] = useState("");

  // console.log("sub category", subCategoryFilter);

  const [sideEffectError, setSideEffectError] = useState<any>(null);

  const { data, error, isLoading, refetch } = useQuery(
    [
      "products",
      { page, search, primaryCategory, subCategory, sortBy, isEnableDisable },
    ],
    fetchProducts
  );

  // Add this function inside your Page component
  const resetFiltersAndRefetch = () => {
    // Reset filters to initial values
    setPrimaryCategoryFilter("");
    setSubCategoryFilter("");
    setSortBy("date desc");
    setIsEnableDisable("");

    // Trigger a refetch of the data
    refetch();
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    if (file.size > 0) {
      try {
        const { data } = await axios.post("/api/upload-xlsx", formData);

        // console.log(data.products.length);
        // console.log(data.products);
      } catch (error) {
        setSideEffectError(error);
      }
    } else {
      setSideEffectError(new Error("No file selected"));
    }
  };

  // single  product
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await axios.post("/api/upload-xlsx", formData);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (sideEffectError) {
      throw new Error(sideEffectError);
    }
  }, [sideEffectError]);

  const handlePrimaryCategoryChange = (selectedPrimaryCategory: string) => {
    setPrimaryCategoryFilter(selectedPrimaryCategory);
  };
  const handleSubCategoryChange = (selectedSubCategory: string) => {
    setSubCategoryFilter(selectedSubCategory);
  };
  const handlePrimaryEnableDisable = (selectedEnableDisable: string) => {
    setIsEnableDisable(selectedEnableDisable);
  };

  //pagination

  // search product

  // if (!isLoading) {
  //   let products: ProductType[] = data.products;
  //   try {
  //     products = ProductsSchema.parse(products);
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       // console.log(error.issues);
  //     }
  //   }

  // if (products.length > 0)
  return (
    <div className="">
      <div className="flex justify-end my-2 gap-x-2 capitalize pr-4">
        <AddProduct />
        {/* <Button type="submit">Add product</Button> */}
      </div>
      <div className="p-4">
        <form
          className="flex justify-between items-center py-2 px-4 rounded-md border"
          onSubmit={handleUpload}
        >
          <input type="file" name="file" />
          <Button type="submit">Upload</Button>
        </form>
      </div>
      <Separator />
      <div className="flex gap-2 py-4 px-4">
        <div>
          <SearchOrders />
        </div>
        <div>
          {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <Select
            onValueChange={(selectedPrimaryCategory) =>
              handlePrimaryCategoryChange(selectedPrimaryCategory)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a primary-category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="primary-category">
                primary-category
              </SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="non-medicine">Non Medicine </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <Select
            onValueChange={(selectedSubCategory) =>
              handleSubCategoryChange(selectedSubCategory)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a sub-category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="sub-category">
                sub-category
              </SelectItem>
              {sub_categories &&
                sub_categories.map((subCategory: string, i: number) => (
                  <SelectItem value={subCategory} key={i}>
                    {subCategory}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* onValueChange={field.onChange} defaultValue={field.value} */}
          <Select onValueChange={(sort) => setSortBy(sort)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="sort By">
                Sort By
              </SelectItem>
              <SelectItem value="name asc">Name(A-Z)</SelectItem>
              <SelectItem value="name desc">Name(Z-A)</SelectItem>
              <SelectItem value="price asc">Price(Low-High)</SelectItem>
              <SelectItem value="price desc">Price(High-Low)</SelectItem>
              <SelectItem value="date asc">date(Start-End)</SelectItem>
              <SelectItem value="date desc">date(End-Start)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* is Enable  or is Disable */}
        <div>
          <Select
            onValueChange={(selectedEnableDisable) =>
              handlePrimaryEnableDisable(selectedEnableDisable)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="primary-category">
                Enable/Disable
              </SelectItem>
              <SelectItem value="enable">Enable</SelectItem>
              <SelectItem value="disable">Disable </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div
            className="border text-center py-[10px] px-6 flex flex-col justify-center items-center cursor-pointer "
            onClick={resetFiltersAndRefetch}
          >
            <FiRefreshCcw className="active:-rotate-90 " />
          </div>
        </div>
      </div>
      <Separator />
      {isLoading ? (
        <h1 className="mt-5 text-center"> product data loading </h1>
      ) : !data?.products || data?.products?.length === 0 ? (
        <h1 className="mt-5 text-center"> data not found </h1>
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Image</TableHead>
              <TableHead className="w-[21%]">Name</TableHead>
              <TableHead className="w-[21%]">Short Description</TableHead>
              <TableHead className="w-[15%]">Type(S/Q/M/S)</TableHead>
              <TableHead className="w-[11%]">Price</TableHead>
              <TableHead className="w-[7%]">Stock</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products?.map((product: ProductType) => (
              <TableRow key={product._id}>
                <TableCell className="">
                  <div className="relative w-14 h-14">
                    <Image
                      src={product.images[0]?.at(-1)!}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell className="overflow-hidden">
                  <div className="">
                    <p className="capitalize truncate">{product.name}</p>
                    <p className="italic capitalize truncate text-muted-foreground">
                      {product?.generic_name}
                      {/* {product?.generic_names?.join("+")} */}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="overflow-hidden">
                  <div>
                    <p className="capitalize truncate">
                      Primary: {product.primary_category}
                    </p>
                    <p className="capitalize truncate">
                      Sub: {product.sub_category}
                    </p>
                    <p className="italic capitalize truncate text-muted-foreground">
                      {product.company_name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="overflow-hidden capitalize truncate">
                  {product.type && product.type}(
                  {product.strength && product.strength}
                  {product.quantity &&
                    product.quantity + " " + product.quantity_unit}
                  {product.model && product.model}
                  {product.size && product.size})
                </TableCell>
                <TableCell className="">
                  <span>{product.price}</span>
                  <span>&#2547;</span>
                </TableCell>
                <TableCell className="">{product.stock}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-3 2xl:flex-row">
                    <EditProductSheet product={product} />
                    <DeleteAlertDialogue product={product} refetch={refetch} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mb-6 mt-3">
        {!isLoading ? (
          !data?.products || data.products.length === 0 ? (
            ""
          ) : (
            <CPagination totalPages={data?.totalPages} />
          )
        ) : (
          ""
        )}
      </div>
      <div></div>
    </div>
  );
}
