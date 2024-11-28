import React, { useEffect, useState } from "react";
import { getAllTasks } from "../../api/Task";
import { Button } from "@chakra-ui/react";
import Layout from "../Layout";
import { ArrowUpDown, Check, MoveDown } from "lucide-react";

import TaskTable from "./TaskTable";
import Demo from "./AddTask"; // Ensure the Demo component is properly imported

import MenuItemList from "./MenuItem";
import Loading from "../Loading/Loading";

function ViewAllTask() {
  const { data, error, isLoading, refetch } = getAllTasks();
  console.log(data);

  const colHeading = [
    "Task Id",
    "Title",
    "Priority",
    "Status",
    "Start Time",
    "End Time",
    "Time to finish",
    "Edit",
    "Delete",
  ];

  const [sorting, setSorting] = useState("remove sort");
  const [priorityFilter, setPriorityFilter] = useState("remove Priority");
  const [statusFilter, setStatusFilter] = useState("remove Status");

  const [taskList, setTaskList] = useState([]);
  const [originalTaskList, setOriginalTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (data?.tasks) {
      setTaskList(data.tasks);
      setOriginalTaskList(data.tasks);
    }
  }, [data]);
  useEffect(() => {
    handleSort();
  }, [sorting, priorityFilter, statusFilter]);

  const handleSort = () => {
    let filteredTasks = [...originalTaskList];
    if (priorityFilter !== "remove Priority") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === parseInt(priorityFilter)
      );
    }
    if (statusFilter !== "remove Status") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === (statusFilter === "Finished")
      );
    }
    switch (sorting) {
      case "ASC Start Time":
        filteredTasks.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );
        break;
      case "DSC Start Time":
        filteredTasks.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        break;
      case "ASC End Time":
        filteredTasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      case "DSC End Time":
        filteredTasks.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
        break;
      case "remove sort":
      default:
        break;
    }
    setTaskList(filteredTasks);
  };

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <div className="w-11/12 mt-4 flex justify-between">
            <h1 className="text-4xl font-serif font-bold ">Task List</h1>
          </div>
          <div className="w-11/12 mt-4 flex justify-between">
            <div>
              <Button
                className="bg-violet-500 p-4 m-4"
                onClick={() => setOpenModal(true)}
              >
                Add Task
              </Button>
            </div>
            <div className="flex">
              {sorting !== "remove sort" && (
                <h1 className="flex mx-2 p-2 h-fit w-fit text-black bg-white rounded-2xl">
                  <Check color="green" />
                  {sorting}
                </h1>
              )}
              {priorityFilter !== "remove Priority" && (
                <h1 className="flex mx-2 p-2 h-fit w-fit text-black bg-white rounded-2xl">
                  <Check color="green" />
                  {priorityFilter}
                </h1>
              )}
              {statusFilter !== "remove Status" && (
                <h1 className="flex mx-2 p-2 h-fit w-fit text-black bg-white rounded-2xl">
                  <Check color="green" />
                  {statusFilter}
                </h1>
              )}
              <MenuItemList
                menuList={[
                  "ASC Start Time",
                  "DSC Start Time",
                  "ASC End Time",
                  "DSC End Time",
                  "remove sort",
                ]}
                menuButton={"Sort"}
                onSelect={(type) => {
                  setSorting(type);
                }}
              />

              <MenuItemList
                menuList={["1", "2", "3", "4", "5", "remove Priority"]}
                menuButton={"Priority"}
                onSelect={(priority) => {
                  setPriorityFilter(priority);
                }}
              />

              <MenuItemList
                menuList={["Finished", "Pending", "remove Status"]}
                menuButton={"Status"}
                onSelect={(status) => {
                  setStatusFilter(status);
                }}
              />
            </div>
          </div>
          <div className="w-full overflow-auto flex items-center justify-center">
            <TaskTable
              taskList={taskList}
              colHeading={colHeading}
              refetchTasks={refetch}
            />
          </div>

          {openModal && (
            <Demo
              openModal={openModal}
              setOpenModal={setOpenModal}
              refetchTasks={refetch}
              isaddTask={true}
              taskId={null}
              currentStatus={false}
              setLoading={setLoading}
            />
          )}
        </div>
      )}
    </Layout>
  );
}

export default ViewAllTask;
