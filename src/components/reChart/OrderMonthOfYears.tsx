"use client";
import { fetchOrderByMonthOfYears } from "@/query_controllers/orderByMonthOfYears";
import { calculateMonth } from "@/utils/rechart";
import { useQuery } from "react-query";
import SalesOrderByMonth from "./SalesOrderByMonth";
import SalesPriceByMonth from "./SalesPriceByMonth";

const OrderMonthOfYears = ({ year }: any) => {
  
  const { data, isLoading } = useQuery(
    ["orderByMonthOfYears", { startDate: year }],
    fetchOrderByMonthOfYears
  );

  if (isLoading) {
    return;
  }

  // console.log("data", data);

  const updatedTotalOrderByMonth = data?.totalOrderByMonthOfYear?.map(
    (item: any) => {
      return {
        ...item,
        month: calculateMonth(parseInt(item.month)),
      };
    }
  );

  return (
    <div>
      <div className="md:flex justify-between items-center">
        <div className="w-full">
          <SalesOrderByMonth TotalOrderByMonth={updatedTotalOrderByMonth} />
        </div>
        <div className="w-full">
          <SalesPriceByMonth TotalOrderByMonth={updatedTotalOrderByMonth} />
        </div>
      </div>
    </div>
  );
};

export default OrderMonthOfYears;
