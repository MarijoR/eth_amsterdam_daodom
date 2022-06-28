import Error from "components/shared/form/Error";
import Form from "components/shared/form/Form";
import Input from "components/shared/form/Input";
import InputWrapper from "components/shared/form/InputWrapper";
import Label from "components/shared/form/Label";
import SubmitButton from "components/shared/form/SubmitButton";
import { loginUser } from "lib/firebase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";



export default function Login({ history }) {
    const {register, handleSubmit, formState: {errors}} = useForm({ mode: "onBlur" })
    const mutation = useMutation(loginUser, {
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
    })
  
    function onSubmit(data) {
      const { email, password } = data;
      mutation.mutate({ email, password });
    }
  
  return (
  <Form onSubmit={handleSubmit(onSubmit)}>
  <InputWrapper>
    <Label>email</Label>
    <Input {...register("email", {
      required: "Email is required",
      maxLength: {
        value: 30,
        message: "Musst be less than 30 characters"
      },
    })} type="email" />
    <Error>{errors.email?.message}</Error>
  </InputWrapper>
  <InputWrapper>
    <Label>password</Label>
    <Input {...register("password", { 
      required: "Password is required",
      minLength: {
        value: 4,
        message: "Musst be at least 4 characters"
      }, 
      maxLength: {
        value: 30,
        message: "Musst be less than 30 characters"
      },
    })} type="password" />
    <Error>{errors.password?.message}</Error>
  </InputWrapper>
  <SubmitButton type="submit">log in</SubmitButton>
</Form>
);
}
