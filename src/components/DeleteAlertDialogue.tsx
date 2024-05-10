import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FiMinusCircle } from "react-icons/fi";

import { Button } from "./ui/button";

import { ProductType } from "@/types";
import { getPriceWithDiscount } from "@/utils/price";
import axios from "axios";
import { useMutation } from "react-query";

export default function DeleteAlertDialogue({
  product,
  refetch,
}: {
  product: ProductType;
  refetch: any;
}) {
  const editProductIsEnable = useMutation({
    mutationFn: (editStatus: any) => {
      return axios.post("/api/product-is-enable", editStatus);
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["products"] });
      refetch();
    },
    onError: () => {
      console.log("order status update failed");
    },
  });

  const handelEnableDisable = (IsEnable: boolean) => {
    // status means product is enable or disable
    const status = {
      is_enabled: IsEnable,
      _id: product._id,
    };
    editProductIsEnable.mutate(status);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={`${product.is_enabled == true ? "destructive" : "default"}`}
          className={`flex gap-1 `}
        >
          <FiMinusCircle size={16} />
          {product.is_enabled === true ? "DISABLE" : "ENABLE"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="!capitalize">
              {product.is_enabled === true ? "Disable" : "Enable"}
            </span>
            <span> Product?</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span> Are you sure you want to </span>
            <span className="lowercase">
              {product.is_enabled === true ? "DISABLE" : "ENABLE"}
            </span>
            <span> this product?</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <p className="capitalize">Name: {product.name}</p>
          <p className="capitalize">
            Primary Category: {product.primary_category}
          </p>
          <p className="capitalize">Sub Category: {product.sub_category}</p>
          <p>
            Price:
            {getPriceWithDiscount(
              product.price,
              product?.discount_percentage || 0
            )}
            &#2547;
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancels</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              handelEnableDisable(product.is_enabled ? false : true)
            }
          >
            {product.is_enabled === true
              ? editProductIsEnable.isLoading
                ? "DISABLING..."
                : "DISABLE"
              : editProductIsEnable.isLoading
              ? "ENABLING..."
              : "ENABLE"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
