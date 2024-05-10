"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import fetchDashboard from "@/query_controllers/dashboard";
import { useQuery } from "react-query";

// import for pi chart start
import RecentOrder from "@/components/RecentOrder";

import OrderMonthOfYears from "@/components/reChart/OrderMonthOfYears";
import TotalOrderByStatus from "@/components/reChart/TotalOrderByStatus";
import TotalOrderByZone from "@/components/reChart/TotalOrderByZone";
import { YearPicker } from "@/components/reChart/YearPicker";
import { useState } from "react";

// pi chart end

export default function Home() {
  const { data, error, isLoading, refetch } = useQuery(
    ["orders-dashboard", {}],
    fetchDashboard
  );

  // total order by area zone

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // total order by month
  const [year, setYear] = useState<Date>();

  console.log("client site year", year);

  if (isLoading) {
    return <h2> loading</h2>;
  }

  return (
    <div>
      <div className="grid grid-cols-6 gap-3 mt-3 mx-1">
        <Card className="bg-orange-600">
          <CardHeader>
            <CardTitle className="text-sm font-medium capitalize">
              Total-Orders{" "}
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-white">
              {data?.totalOrderCount}
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className="bg-lime-400">
          <CardHeader>
            <CardTitle className="text-sm font-medium capitalize">
              Total-Users
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-white">
              {data?.totalUser}
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        {data?.totalOrderByStatus?.map((status: any, index: number) => (
          // <Card key={index} style={{ backgroundColor: COLORS[index] }}>
          //   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          //     <CardTitle className="text-sm font-medium">
          //       {status?._id}
          //     </CardTitle>
          //     <CreditCard className="h-4 w-4 text-muted-foreground" />
          //   </CardHeader>
          //   <CardContent>
          //     <div className="text-2xl font-bold">{status?.total}</div>
          //   </CardContent>
          // </Card>
          <Card
            className=""
            key={index}
            style={{ backgroundColor: COLORS[index] }}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium capitalize">
                {status?._id}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-white">
                {status?.total}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>

      {/* orderByStatus pi chart orderByZone */}
      <div className="md:flex justify-around items-center mt-3">
        <div>
          <span className="capitalize text-center"> Orders Status</span>
          <TotalOrderByStatus totalOrderByStatus={data?.totalOrderByStatus} />
        </div>
        <div>
          <TotalOrderByZone />
        </div>
      </div>

      {/* total order and total price by month */}

      <div>
        <div className="flex justify-center items-center gap-x-3">
          <div className="capitalize "> sales of year</div>
          <YearPicker setYear={setYear} />
        </div>
        <OrderMonthOfYears year={year} />
      </div>
      {/* <div className="md:flex justify-between items-center">
        <div className="w-full">
          <SalesOrderByMonth TotalOrderByMonth={updatedTotalOrderByMonth} />
        </div>
        <div className="w-full">
          <SalesPriceByMonth TotalOrderByMonth={updatedTotalOrderByMonth} />
        </div>
      </div> */}

      <div className="flex justify-center items-center">
        <div className="">
          <span className="capitalize">order by day</span>
        </div>
        <div>
          <span className="capitalize">price by day</span>
          {/* <AreaChart
            width={500}
            height={400}
            data={data?.totalOrderByDayOfWeek}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total_price"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart> */}
        </div>
      </div>

      <div>
        <RecentOrder resentOrders={data?.resentOrders} />
      </div>
    </div>
  );
}
