import React, { useEffect } from "react";
import Layout from "../Layout";
import { getAllDashboardInfo } from "../../api/Dashboard";

import { HStack, Table } from "@chakra-ui/react";
function Dashboard() {
  const { data, loading, error } = getAllDashboardInfo();

  const colHeading = [
    "Task Priority",
    "Pending task",
    "Time laspsed",
    "Time to finish",
  ];

  useEffect(() => {
    () => getAllDashboardInfo();
  }, []);

  return (
    <Layout>
      {console.log(data)}
      <div className="flex flex-col m-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="mt-11">
          <h1 className="text-3xl font-semibold mb-3"> Summary</h1>
          <div className="flex flex-col sm:flex-row ">
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-lg items-center justify-center">
              <span className="text-2xl font-semibold">Total Tasks</span>{" "}
              <span className="text-2xl font-bold">{data?.totalTask}</span>
            </h1>
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  bg-gradient-to-r from-green-500 to-green-800 p-4 rounded-lg items-center justify-center">
              <span className="text-2xl font-semibold">Percentage Finshed</span>{" "}
              <span className="text-2xl font-bold">
                {data?.percentageComplete}%
              </span>
            </h1>
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  bg-gradient-to-r from-red-500 to-red-800 p-4 rounded-lg items-center justify-center">
              <span className="text-2xl font-semibold">Percentage Pending</span>{" "}
              <span className="text-2xl font-bold">
                {data?.percentagePending}%
              </span>
            </h1>
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  bg-gradient-to-r from-violet-500 to-violet-800 p-4 rounded-lg items-center justify-center">
              <span className="text-2xl font-semibold">
                Average Time to complete
              </span>{" "}
              <span className="text-2xl font-bold">
                {data?.averageTimePerCompletedTask}
              </span>
            </h1>
          </div>
        </div>
        <div className="mt-11">
          <h1 className="text-3xl font-semibold mb-3"> Pending Task Summary</h1>
          <div className="flex flex-col sm:flex-row ">
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  border-2 border-slate-50  p-4 rounded-lg items-center justify-center text-red-500">
              <span className="text-2xl font-semibold">Total Pending</span>{" "}
              <span className="text-2xl font-bold">{data?.pending}</span>
            </h1>
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  border-2 border-slate-50  p-4 rounded-lg items-center justify-center text-green-500">
              <span className="text-2xl font-semibold">Total Time Lapsed</span>{" "}
              <span className="text-2xl font-bold">
                {data?.totalTimeLapsed}
              </span>
            </h1>
            <h1 className="flex flex-col sm:mx-4 my-2 sm:my-0  border-2 border-slate-50  p-4 rounded-lg items-center justify-center text-purple-500">
              <span className="text-2xl font-semibold">Total Time Left</span>{" "}
              <span className="text-2xl font-bold">
                {data?.estimatedTimeLeft}
              </span>
            </h1>
          </div>
        </div>
        <div className="mt-11">
          <h1 className="text-3xl font-semibold mb-3">
            {" "}
            Table of Priority Pending
          </h1>
          <Table.Root
            size="sm"
            className="sm:w-10/12 w-full overflow-x-auto"
            striped
          >
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
              {data?.priorityStats?.map((item) => (
                <Table.Row className="text-md">
                  <Table.Cell className="border-2 border-slate-50">
                    {item?.priority}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    {item?.pendingTasks}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-slate-50">
                    {item?.totalTimeLapsed}
                  </Table.Cell>

                  <Table.Cell className="border-2 border-slate-50">
                    {item?.estimatedTimeLeft}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          {data?.priorityStats?.length === 0 && (
            <h1 className="text-3xl m-4 flex items-center sm:w-10/12 w-full justify-center font-bold text-slate-600">
              No task to show
            </h1>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
