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

const addTask = async ({
  title,
  priority,
  startDate,
  startTime,
  endDate,
  endTime,
}) => {
  const { data } = await AuthAPI().post("/addTask", {
    title,
    priority,
    startDate,
    startTime,
    endDate,
    endTime,
  });
  return data;
};

const deleteTask = async (taskId) => {
  console.log("hhhh", taskId);

  const { data } = await AuthAPI().delete(`/${taskId}/deleteTask`);
  return data;
};

const updateTask = async (taskId, formdata) => {
  const { data } = await AuthAPI().put(`/${taskId}/updateTask`, formdata);
  return data;
};

const getAllTasksFunction = async () => {
  const { data } = await AuthAPI().get("/viewTask");
  return data;
};

const getAllTasks = () =>
  useQuery({
    queryKey: ["allTasks"],
    queryFn: getAllTasksFunction, // Directly pass the function reference
  });

export { getAllTasks, addTask, deleteTask, updateTask };
