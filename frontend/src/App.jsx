import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Authentications/Register";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Login from "./Components/Authentications/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ViewAllTask from "./Components/Tasks/ViewAllTask";
import UnProtectedRoute from "./Routes/UnProtectedRoute";
function App() {
  const queryClient = new QueryClient();
  function isUserValid() {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  }
  useEffect(() => {
    let val = localStorage.getItem("token");
    if (!isUserValid()) {
      if (val !== null) {
        toast.error("Session expired! Please Login");
      }
    }
    if (val === null) {
      toast.success("Please Login");
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<UnProtectedRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viewTask" element={<ViewAllTask />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
