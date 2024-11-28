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
} from "@/components/ui/dialog";
import { Button, Input, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
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
}) => {
  console.log("currentStatus", currentStatus);

  // State for form inputs
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(currentStatus); // Add state for status

  // Handle to convert date and time to ISO format
  const handleToISO = (parts1, parts2) => {
    const combined = `${parts1}T${parts2}:00.000Z`; // Ensure Z for UTC
    return new Date(combined).toISOString();
  };

  const { mutate: addTaskMutate, isLoading } = useMutation({
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
      if (
        !startDate ||
        !startTime ||
        !endDate ||
        !endTime ||
        !title ||
        !priority
      ) {
        toast.error("Please enter all the details");
        return;
      }
      if (priority > 5 || priority < 1) {
        toast.error("The priority should be in range 1 to 5");
        return;
      }
      const start = handleToISO(startDate, startTime);
      const end = handleToISO(endDate, endTime);
      if (start > end) {
        toast.error("start time must be greater than end time");
        return;
      }
      await addTaskMutate({
        title,
        priority,
        startTime: start,
        endTime: end,
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      let formdata = {};
      if (startDate && startTime) {
        formdata.startTime = handleToISO(startDate, startTime);
      }
      if (endDate && endTime) {
        formdata.endTime = handleToISO(endDate, endTime);
      }
      if (title) formdata.title = title;
      if ((priority && priority > 5) || priority < 1) {
        toast.error("The priority should be in range 1 to 5");
        return;
      }
      if (priority) formdata.priority = priority;
      if (status) {
        formdata.status = true;
        formdata.endTime = new Date();
      } else formdata.status = false;

      // Call the API to update the task
      const response = await updateTask(taskId, formdata);
      console.log("response", response);

      if (response.success === true) {
        toast.success("Task updated successfully!");
        setOpenModal(false);
        refetchTasks();
      }
    } catch (error) {
      console.log("eee", error);
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
      // Pre-fill form with the existing task data, including the status
      setStatus(currentStatus);
      // Populate other fields with existing task data (you can use an API call or props)
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
