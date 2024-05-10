import axios from "axios";

export const fetchProducts = async ({ queryKey }: any) => {
  const [_, params] = queryKey;
  const queryString = new URLSearchParams(params).toString();

  try {
    const { data } = await axios.get(`/api/${queryKey[0]}?${queryString}`);
    // const { data } = await axios.get(`/api/products?${queryString}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
