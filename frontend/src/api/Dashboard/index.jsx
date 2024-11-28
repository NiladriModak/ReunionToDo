import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const AuthAPI = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/task`,
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getAllInfoFunction = async () => {
  const { data } = await AuthAPI().get("/taskStats");
  return data;
};

const getAllDashboardInfo = () =>
  useQuery({
    queryKey: ["allInfo"],
    queryFn: getAllInfoFunction,
  });

export { getAllDashboardInfo };
