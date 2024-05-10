import axios from "axios";

export const fetchUsers = async ({ queryKey }: any) => {
  const [_, params] = queryKey;
  const queryString = new URLSearchParams(params).toString();

  try {
    const { data } = await axios.get(`/api/users?${queryString}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
