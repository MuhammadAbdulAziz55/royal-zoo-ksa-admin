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

import { Button } from "@/components/ui/button";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useMutation } from "react-query";

const DeleteAdminUser = ({ admin, activeAdmin, refetch }: any) => {
  const deleteAdmin = useMutation({
    mutationFn: (deleteAdminId: any) => {
      return axios.delete(`/api/admins?_id=${deleteAdminId}`);
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.log("order status update failed");
    },
  });

  const handelDeleteAdmin = async (id: any) => {
    if (id !== activeAdmin?._id && activeAdmin?.is_SupperAdmin !== true) {
      alert("you can not delete admins ");
      return;
    } else {
      // delete admin app call
      deleteAdmin.mutate(id);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={
            activeAdmin?.is_SupperAdmin
              ? false
              : admin?._id !== activeAdmin?._id
          }
        >
          <MdDelete size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hi Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            permanently delete your account and remove your data
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handelDeleteAdmin(admin._id)}
            disabled={deleteAdmin?.isLoading}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminUser;
