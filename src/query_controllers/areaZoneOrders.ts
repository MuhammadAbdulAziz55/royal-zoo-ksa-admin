import axios from "axios";

export const fetchAreaZoneOrders = async ({ queryKey }: any) => {
  const [_, params] = queryKey;
  const queryString = new  URLSearchParams(params).toString();

  try {
    const { data } = await axios.get(`/api/area-zone-orders?${queryString}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
