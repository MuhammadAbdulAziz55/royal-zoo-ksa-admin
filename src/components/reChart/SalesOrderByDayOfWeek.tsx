import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const renderTooltip = (props: any) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    // Summing up totalOrders from all active payload items
    const totalOrders = payload.reduce(
      (sum: any, entry: any) => sum + entry.payload.totalOrders,
      0
    );

    // Assuming all payloads have the same _id, so just picking the first one to display the week
    const week = payload[0].payload._id;

    return (
      <div className="bg-background text-foreground shadow-lg p-4 border border-primary rounded-lg">
        Month: {week}
        <br />
        Total Orders: {totalOrders}
      </div>
    );
  }

  return null;
};
const barRenderCustomizedLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
};

const SalesOrderByDayOfWeek = ({ OrderByDayOfWeek }: any) => {
  return (
    <ComposedChart
      width={500}
      height={400}
      data={OrderByDayOfWeek}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="day" scale="band" />
      <YAxis />
      <Tooltip content={renderTooltip} />

      {/* <Legend /> */}
      <Bar dataKey="totalOrders" barSize={20} fill="#413ea0">
        <LabelList dataKey="totalOrders" content={barRenderCustomizedLabel} />
      </Bar>
      <Line type="monotone" dataKey="totalOrders" />
    </ComposedChart>
  );
};

export default SalesOrderByDayOfWeek;
