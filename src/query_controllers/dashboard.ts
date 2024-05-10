import axios from "axios";

const fetchDashboard = async () => {
  try {
    const { data } = await axios.get(`/api/order-dashboard`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchDashboard;
