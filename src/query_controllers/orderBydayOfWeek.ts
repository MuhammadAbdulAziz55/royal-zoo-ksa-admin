import axios from "axios";

export const fetchOrderByMonthOfYears = async ({ queryKey }: any) => {
  const [_, params] = queryKey;
  const queryString = new URLSearchParams(params).toString();

  try {
    const { data } = await axios.get(`/api/order-day-of-week?${queryString}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
