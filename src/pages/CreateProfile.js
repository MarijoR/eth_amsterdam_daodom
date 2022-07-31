import { useState } from "react";
import Form from "components/shared/form/Form";
import Input from "components/shared/form/Input";
import InputWrapper from "components/shared/form/InputWrapper";
import Label from "components/shared/form/Label";
import { RadioGroupWrapper } from "components/shared/form/RadioGroup";
import RadioGroupOption from "components/shared/form/RadioGroup/Option";
import SelectWrapper from "components/shared/form/SelectWrapper";
import SubmitButton from "components/shared/form/SubmitButton";
import { useForm } from "react-hook-form";
import Error from "components/shared/form/Error";
import useStore from "store";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function CreateProfile() {
  const user = useStore((s) => s.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [type, setType] = useState("text");

  function onSubmit(data) {}

  return (
    <Form onSubmit={handleSubmit(onSubmit)} wide>
      <InputWrapper>
        <Label>Create a Lens NFT Profile</Label>
      </InputWrapper>
      <InputWrapper>
        <Label>title</Label>
        <Input
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title musst be at least 5 characters",
            },
            maxLength: {
              value: 100,
              message: "Title musst be less than 100 characters",
            },
          })}
          type="text"
          placeholder="title"
        />
        <Error>{errors.title?.message}</Error>
      </InputWrapper>
      <InputWrapper>
        <Label>My Ethereum Address</Label>
        <Input
          {...register("address", {
            required: "Ethereum Address is required",
            minLength: {
              value: 40,
              message: "Please check if your ethereum address is correct",
            },
            maxLength: {
              value: 45,
              message: "Please check if your ethereum address is correct",
            },
          })}
          type="text"
          placeholder="address"
        />
        <Error>{errors.address?.message}</Error>
      </InputWrapper>
      <SubmitButton type="submit">create proposal</SubmitButton>
    </Form>
  );
}
