import { Dialog, HStack, Table } from "@chakra-ui/react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTask } from "../../api/Task";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Demo from "./AddTask";
import Loading from "../Loading/Loading";

// TaskTable.jsx

const TaskTable = ({ taskList, colHeading, refetchTasks }) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [currentStatus, setCurrentStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accualTask, setAccualTask] = useState(null);
  const handleDelete = async (taskId, refetchTasks) => {
    setLoading(true);
    const response = await deleteTask(taskId);

    if (response.success === true) {
      await refetchTasks();
      toast.success("Successfully deleted the selected task");
    } else {
      toast.error("Error in deletion");
    }
    setLoading(false);
  };

  const handleUpdate = (taskuid, stat, task) => {
    setLoading(true);
    setTaskId(taskuid);
    setAccualTask(task);
    setCurrentStatus(stat);
    setOpenUpdateModal(!openUpdateModal);
    setLoading(false);
  };
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  useEffect(() => {
    refetchTasks();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {loading ? (
        <Loading />
      ) : (
        <Table.ScrollArea borderWidth="1px" className="w-11/12 ">
          <Table.Root size="sm" className="w-full overflow-x-auto" striped>
            <Table.Header>
              <Table.Row className="h-16 bg-gradient-to-r from-cyan-500 to-blue-500">
                {colHeading?.map((e, ind) => (
                  <Table.ColumnHeader
                    key={ind}
                    className="border-2 border-white text-lg"
                  >
                    {e}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {taskList?.map((item) => (
                <Table.Row key={item.id} className="text-md">
                  <Table.Cell className="border-2 border-slate-50">
                    {item._id}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    {item.title}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    {item.priority}
                  </Table.Cell>
                  <Table.Cell className={`border-2 border-slate-50 `}>
                    <h3
                      className={`text-center rounded-xl ${item.status === true ? "text-green-800 bg-green-300" : "text-red-800 bg-red-200"}`}
                    >
                      {item.status === true ? "Finished" : "Pending"}
                    </h3>
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    <HStack gap={3}>
                      <h1>{item.startTime.substr(0, 10)}</h1>
                      <h1>{item.startTime.substr(11, 5)}</h1>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    <HStack gap={3}>
                      <h1>{item.endTime.substr(0, 10)}</h1>
                      <h1>{item.endTime.substr(11, 5)}</h1>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    {item.status === false
                      ? formatDuration(
                          new Date(item.endTime) - new Date(item.startTime)
                        )
                      : "00 hr 00 min"}
                  </Table.Cell>
                  <Table.Cell
                    className="border-2 border-slate-50"
                    textAlign="end"
                  >
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => handleUpdate(item._id, item.status, item)}
                      size={20}
                    />
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50 flex justify-center">
                    <Trash2
                      onClick={() => handleDelete(item._id, refetchTasks)}
                      size={20}
                      className="text-rose-600 cursor-pointer"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}
      {taskList.length === 0 && (
        <h1 className="text-3xl m-4 flex items-center w-full justify-center font-bold text-slate-600">
          Create Task
        </h1>
      )}
      {openUpdateModal && (
        <Demo
          openModal={openUpdateModal}
          setOpenModal={setOpenUpdateModal}
          refetchTasks={refetchTasks}
          isaddTask={false}
          taskId={taskId}
          currentStatus={currentStatus}
          setLoading={setLoading}
          accualTask={accualTask}
        />
      )}
    </div>
  );
};
export default TaskTable;
