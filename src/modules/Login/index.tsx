"use client";
import React, { useContext, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { AppContext } from "@/context/AppContext";
import { AppContextTypes } from "@/context/types/AppContextTypes";
import { isValidEmail, isValidPassword } from "@/utils";

const defaultErrorState = {
  email: "",
  password: "",
};

const Login = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    users,
    setUsers,
    setLoggedInUser,
  } = useContext(AppContext) as AppContextTypes;

  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(defaultErrorState);

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setErrors(defaultErrorState);
  };

  const handleSubmit = async (email: string, password: string) => {
    if (!isValidPassword(password.trim())) {
      setErrors((err) => ({
        ...err,
        password:
          "Invalid password, Password should have eight characters, at least one letter and one number",
      }));
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashedPassword = Array.from(new Uint8Array(hash))
      .map((byte) => String.fromCharCode(byte))
      .join("");
    if (showSignUp) {
      if (users[email]) {
        setErrors((err) => ({
          ...err,
          email: "User already exists",
        }));
        return;
      }

      const newUser = {
        email,
        password: hashedPassword,
        userId: crypto.randomUUID(),
      };
      setUsers((curUsers) => ({ ...curUsers, [email]: newUser }));
      console.log("new user added");
      setIsAuthenticated(true);
      setLoggedInUser(newUser);
      return;
    }
    if (!users[email]) {
      setErrors((err) => ({ ...err, email: "User doesn't exist" }));
      return;
    }

    if (users[email]?.password !== hashedPassword) {
      setErrors((err) => ({ ...err, password: "Incorrect password" }));
      return;
    }

    setIsAuthenticated(true);
    setLoggedInUser(users[email]);
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setErrors((err) => ({ ...err, email: "" }));
    const val = e.target.value?.trim();
    // if (!isValidEmail(val)) {
    //   setErrors((err) => ({ ...err, email: "Invalid email" }));
    // }
    setEmail(val);
  };

  const onEmailBlur = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const val = e.target.value?.trim();
    if (!isValidEmail(val)) {
      setErrors((err) => ({ ...err, email: "Invalid email" }));
    }
  };

  // const onPasswordBlur = (
  //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => {
  //       const val = e.target.value?.trim();
  //       if (val.length<8) {
  //         setErrors((err) => ({
  //           ...err,
  //           password:
  //             "Invalid password, Password should have eight characters",
  //         }));
  //       }
  // };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setErrors((err) => ({ ...err, password: "" }));
    const val = e.target.value?.trim();
    // if (!isValidPassword(val)) {
    //   setErrors((err) => ({
    //     ...err,
    //     password:
    //       "Invalid password, Password should have at least eight characters, at least one letter and one number",
    //   }));
    // }
    setPassword(val);
  };

  const disableSubmitButton =
    !email.trim() ||
    !password.trim() ||
    !!errors?.email ||
    !!errors.password ||
    !isValidEmail(email.trim());

  return (
    <Box
      component={"form"}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap="16px"
      p="24px"
      height={"80vh"}
      aria-disabled={disableSubmitButton}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(email, password);
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap="4px"
        width={"600px"}
      >
        <TextField
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email id"
          error={!!errors?.email}
          onBlur={onEmailBlur}
        />
        {errors?.email && (
          <Typography variant="caption" color={"indianred"}>
            {errors?.email}
          </Typography>
        )}
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap="4px"
      >
        <TextField
          value={password}
          onChange={handlePasswordChange}
          type="password"
          placeholder="Enter password"
          //   onBlur={onPasswordBlur}
          error={!!errors?.password}
        />
        {errors?.password && (
          <Typography variant="caption" color={"indianred"}>
            {errors?.password}
          </Typography>
        )}
      </Box>

      <Button type="submit" disabled={disableSubmitButton}>
        {showSignUp ? "Sign up" : "Login"}
      </Button>
      <Button
        onClick={() => {
          setShowSignUp((curVal) => !curVal);
          resetStates();
        }}
      >
        {showSignUp ? "Have a account" : "Doesn't have a account?"}
      </Button>
    </Box>
  );
};

export default Login;
