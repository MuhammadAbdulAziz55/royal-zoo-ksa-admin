"use client";
import { fetchAreaZoneOrders } from "@/query_controllers/areaZoneOrders";
import { useState } from "react";
import { useQuery } from "react-query";
import { Pie, PieChart } from "recharts";
import DatePicker from "./DatePicker";

const customLabel = (props: any) => {
  const { total_orders, zone } = props;

  return `${zone}-${total_orders}`;
};
const TotalOrderByZone = () => {
  const [zoneDate, setZoneDate] = useState<Date>();
  const serializedZoneDate = JSON.stringify(zoneDate);

  const { data } = useQuery(
    ["area-zone-orders", { serializedZoneDate }],
    fetchAreaZoneOrders
  );

  return (
    <div>
      <div className="flex justify-between">
        <div className="capitalize "> Orders Zone</div>
        <DatePicker setZoneDate={setZoneDate} />
      </div>

      <div className="pointer-events-none">
        <PieChart width={500} height={400}>
          <Pie
            data={data?.totalOrderByZone}
            dataKey="total_orders"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            label={customLabel}
          />
        </PieChart>
      </div>
    </div>
  );
};

export default TotalOrderByZone;
