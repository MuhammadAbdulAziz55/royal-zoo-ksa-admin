import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TooltipComponent from "./TooltipComponent";
import formatDateTime from "@/utils/timeFormate";

export default function RecentOrder({ resentOrders }: any) {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Recent Orders</CardTitle>
        {/* <CardDescription>Recent orders from your store.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resentOrders?.map((order: any) => (
              <TableRow key={order?._id} className="bg-accent">
                <TableCell>
                  <div className="font-medium">
                    <TooltipComponent
                      text={
                        order.customer_firstName + " " + order.customer_lastName
                      }
                    />
                  </div>
                  <div className=" text-sm text-muted-foreground ">
                    <TooltipComponent text={order.customer_email} />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <TooltipComponent text={order.payment_method} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    <TooltipComponent text={order.order_status} />
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
                <TableCell className="text-right">
                  <TooltipComponent
                    text={`${order.total_price - order.delivery_charge}`}
                  />
                  <span>&#2547;</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
