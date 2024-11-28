import { Button, Card, Input, Stack } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { PasswordInput } from "../ui/password-input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/Authentication";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const navigator = useNavigate();
  const handleClick = async () => {
    try {
      setLoadingButton(true);
      const response = await loginUser({ email, password });
      if (response.data.success === true) {
        toast.success("Logged in successfully");

        localStorage.setItem("token", response.data.token);
        navigator("/dashboard");
      } else {
        toast.error(response.data.message);
      }
      setLoadingButton(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoadingButton(false);
    }
  };
  return (
    <div className=" h-full  flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6 text-slate-50">
        TODO APP - Reunion
      </h2>

      <Card.Root
        maxW="xl"
        className="w-full  md:w-xl bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-400"
      >
        <Card.Header>
          <Card.Title className="text-2xl font-bold">Sign up</Card.Title>
          <Card.Description>
            Allready have an account?
            <Link className="ml-2 font-semibold text-blue-600" to="/register">
              Login
            </Link>
            <h1 className="flex flex-col font-semibold text-md text-green-400">
              <h1>Guest User Login</h1>
              <h1>email = guestUser@gmail.com</h1>
              <h1>password = guestUser@gmail.com</h1>
            </h1>
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="Email">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-slate-50 p-5 h-16 md:h-14"
              />
            </Field>
            <Field label="Password">
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-slate-50 p-5 h-16 md:h-14"
              />
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button
            disabled={loadingButton}
            onClick={handleClick}
            variant="solid"
            className="bg-violet-600 p-4"
          >
            Sign in
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export default Login;
