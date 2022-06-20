//import { useEffect } from "react";
import Error from "components/shared/form/Error";
import Form from "components/shared/form/Form";
import Input from "components/shared/form/Input";
import InputWrapper from "components/shared/form/InputWrapper";
import Label from "components/shared/form/Label";
import SubmitButton from "components/shared/form/SubmitButton";
//import { loginUser } from "lib/firebase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { useState } from "react";
import Torus from "@toruslabs/torus-embed";
import { ethers } from "ethers";
import useStore from "store";
import shallow from "zustand/shallow";

export default function Login({ history }) {
  const [account, setAccount] = useState();
  const [setUser, resetUser] = useStore(
    (s) => [s.setUser, s.resetUser],
    shallow
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  /* const mutation = useMutation(loginUser, {
      onSuccess: () => {
        history.replace('/');
        toast.success('Login successful!')
      },
      onError: (error) => {
        let message = error?.code;
        switch (message) {
          case "auth/wrong-password":
            message = "Fix your username and password"
            break;
          case "auth/user-not-found":
            message = "User could not be found"
            break;
          default:
            break;
        }
        toast.error(message);
      }
    }) */

  async function onSubmit(e) {
    // const { email, password } = data;
    // mutation.mutate({ email, password });
    //e.preventDefault();

    const torus = new Torus({});
    await torus.init({
      enableLogging: false,
    });
    await torus.login();

    const web3 = new ethers.providers.Web3Provider(torus.provider);

    if (!web3._isProvider) {
      toast.error(
        "An error occurred during registration, make sure you do not have other windows open with more information or try again later. "
      );
      resetUser();
    } else {
      history.replace("/");
      toast.success("Login successful!");
      setUser(web3);
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            setAccount(result[0]);
            console.log(result[0]);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    }
    /* const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance }); */
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/*  <InputWrapper>
        <Label>email</Label>
        <Input
          {...register("email", {
            required: "Email is required",
            maxLength: {
              value: 30,
              message: "Musst be less than 30 characters",
            },
          })}
          type="email"
        />
        <Error>{errors.email?.message}</Error>
      </InputWrapper>
      <InputWrapper>
    <Label>password</Label>
    <Input {...register("password", { 
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Musst be at least 8 characters"
      }, 
      maxLength: {
        value: 30,
        message: "Musst be less than 30 characters"
      },
    })} type="password" />
    <Error>{errors.password?.message}</Error>
  </InputWrapper> */}
      <SubmitButton type="submit">log in</SubmitButton>
    </Form>
  );
}
