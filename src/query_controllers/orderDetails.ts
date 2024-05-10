import axios from "axios";

export const fetchOrderDetails = async (ordered_products: any) => {
  try {
    const { data } = await axios.post(`/api/orderProductItems`, {
      ordered_products,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
