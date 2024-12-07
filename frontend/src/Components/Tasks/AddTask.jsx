import { Field } from "../ui/field";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
} from "../ui/dialog";
import { Button, Input, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Switch } from "../ui/switch";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { addTask, updateTask } from "../../api/Task";

const Demo = ({
  openModal,
  setOpenModal,
  refetchTasks,
  isaddTask,
  taskId,
  currentStatus,
  setLoading,
  accualTask,
}) => {
  // console.log("currentStatus", currentStatus);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(currentStatus);

  const handleToISO = (parts1, parts2) => {
    const combined = `${parts1}T${parts2}:00.000Z`;
    return combined;
  };

  const { mutate: addTaskMutate } = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      toast.success("Task added successfully!");
      setOpenModal(false);
      refetchTasks();
      resetForm();
    },
    onError: (error) => {
      toast.error("Error adding task: " + error.message);
    },
  });

  const handleAddTask = async () => {
    try {
      setLoading(true);
      setOpenModal(false);
      if (
        !startDate ||
        !startTime ||
        !endDate ||
        !endTime ||
        !title ||
        !priority
      ) {
        toast.error("Please enter all the details");
        setLoading(false);
        return;
      }
      if (priority > 5 || priority < 1) {
        toast.error("The priority should be in range 1 to 5");
        setLoading(false);
        return;
      }
      const start = handleToISO(startDate, startTime);
      const end = handleToISO(endDate, endTime);
      if (start > end) {
        toast.error("start time must be greater than end time");
        setLoading(false);
        return;
      }
      await addTaskMutate({
        title,
        priority,
        startTime: start,
        endTime: end,
      });
      setLoading(false);
    } catch (error) {
      // console.log("Error", error);
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      setOpenModal(false);

      let formdata = {
        startTime: accualTask.startTime,
        endTime: accualTask.endTime,
        priority: accualTask.priority,
        status: accualTask.status,
      };

      if (startDate && startTime) {
        formdata.startTime = handleToISO(startDate, startTime);
      }
      if (endDate && endTime) {
        formdata.endTime = handleToISO(endDate, endTime);
      }
      if (formdata.endTime < formdata.startTime) {
        toast.error("End time is less than start");
        setLoading(false);
        return;
      }
      if (title) formdata.title = title;
      if (priority === 0) {
      } else if ((priority && priority > 5) || priority < 1) {
        toast.error("The priority should be in range 1 to 5");
        setLoading(false);
        return;
      }

      console.log("accual Task ", accualTask);

      if (priority > 0) formdata.priority = priority;
      if (status) {
        formdata.status = true;
        const localDate = new Date();
        const utcDate = new Date(
          localDate.getTime() - localDate.getTimezoneOffset() * 60000
        );
        formdata.endTime = utcDate.toISOString();
      } else formdata.status = false;

      const response = await updateTask(taskId, formdata);

      if (response.success === true) {
        toast.success("Task updated successfully!");
        setOpenModal(false);
        refetchTasks();
      }
      setLoading(false);
    } catch (error) {
      // console.log("eee", error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPriority(1);
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setStatus(false);
  };

  useEffect(() => {
    if (isaddTask === false && taskId) {
      setStatus(currentStatus);
    }
  }, [isaddTask, taskId, currentStatus]);

  return (
    <DialogRoot
      open={openModal}
      close={() => setOpenModal(false)}
      onInteractOutside={() => setOpenModal(false)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isaddTask === true ? "Add a new task" : "Update task"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap={5}>
            <Field label="Title">
              <Input
                className="border-2 border-slate-50 p-2"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title"
                required
              />
            </Field>
            <Field label="Priority">
              <Input
                className="border-2 border-slate-50 p-2"
                onChange={(e) => setPriority(e.target.value)}
                type="Number"
                placeholder="Priority"
                min={1}
                max={5}
                required
              />
            </Field>
            {isaddTask === false && (
              <Field label="Status">
                <Switch
                  checked={status}
                  onChange={() => setStatus(!status)} // Toggle status
                >
                  {status ? "Finished" : "Pending"}
                </Switch>
              </Field>
            )}

            <Field label="Starting Date and Time">
              <div className="w-full flex">
                <Input
                  className="w-1/2 border-2 border-slate-50 p-2"
                  type="Date"
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  required
                />
                <Input
                  className="w-1/2 border-2 border-slate-50 p-2"
                  type="Time"
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Start Time"
                  required
                />
              </div>
            </Field>
            <Field label="Ending Date And Time">
              <div className="w-full flex">
                <Input
                  className="w-1/2 border-2 border-slate-50 p-2"
                  type="Date"
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  required
                />
                <Input
                  className="w-1/2 border-2 border-slate-50 p-2"
                  type="Time"
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="End Time"
                  required
                />
              </div>
            </Field>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              className="border-2 border-red-600 p-4"
              onClick={() => setOpenModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          {isaddTask === true ? (
            <Button onClick={handleAddTask} className="bg-purple-500 p-4">
              Add task
            </Button>
          ) : (
            <Button onClick={handleUpdateTask} className="bg-purple-500 p-4">
              Update task
            </Button>
          )}
        </DialogFooter>
        {/* <DialogCloseTrigger /> */}
      </DialogContent>
    </DialogRoot>
  );
};

export default Demo;
