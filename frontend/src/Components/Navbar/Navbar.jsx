import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ApiLogout } from "../../api/Authentication";

function Navbar() {
  const navigator = useNavigate();
  const handleLogout = async () => {
    try {
      await ApiLogout();
      localStorage.removeItem("token");
      toast.success("Looged out successfully");
      navigator("/");
    } catch (error) {
      toast.error("Error in logging out");
    }
  };
  return (
    <div className="w-full h-20 bg-slate-700 flex p-6 justify-between ">
      <HStack gap={6}>
        <Link to="/dashboard" className="text-lg font-bold">
          Dashboard
        </Link>
        <Link to="/viewTask" className="text-lg font-bold">
          Task List
        </Link>
      </HStack>

      <Button
        onClick={handleLogout}
        to="/dashboard"
        className=" ml-6 text-lg font-bold cursor-pointer bg-violet-500 p-4"
      >
        Logout
      </Button>
    </div>
  );
}

export default Navbar;
