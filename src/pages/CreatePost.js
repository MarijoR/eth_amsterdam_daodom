import { useState } from "react";
import categories from "categories";
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
import isURL from "validator/lib/isURL";
import useStore from "store";
import { useMutation } from "react-query";
import { createPost, getTimestamp } from "lib/firebase";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const postTypes = [
  {
    label: "link",
    value: "link",
  },
  {
    label: "text",
    value: "text",
  },
];

export default function CreatePost({ history }) {
  const user = useStore((s) => s.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [type, setType] = useState("text");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const mutation = useMutation(createPost, {
    onSuccess: ({ category, id }) => {
      history.push(`/a/${category}/${id}`);
    },
  });

  const handleFlowRateChange = (e) => {
    if (typeof Number(e) !== "number" || isNaN(Number(e)) === true) {
      toast.error("You can only calculate a flowRate based on a number");
      console.log("Error");
    } else {
      let newFlowRateDisplay = calculateFlowRate(e);
      setFlowRateDisplay(newFlowRateDisplay.toString());
    }
  };

  function calculateFlowRate(amount) {
    if (Number(amount) === 0) {
      return 0;
    }
    const amountInWei = ethers.BigNumber.from(amount);
    const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
    const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
    return calculatedFlowRate;
  }

  function onSubmit(data) {
    const { title, address, flowrate, url, text, category } = data;
    if (!user) {
      throw new Error("Login to create posts");
    }
    const post = {
      category,
      title,
      address,
      flowrate,
      type,
      views: 0,
      score: 1,
      created: getTimestamp(),
      upvotePercentage: 100,
      votes: {
        [user.uid]: 1,
      },
      author: {
        uid: user.uid,
        username: user.username,
      },
    };
    if (type === "text") {
      post.text = text;
    } else {
      post.url = url;
    }
    mutation.mutate(post);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} wide>
      <InputWrapper>
        <RadioGroupWrapper>
          {postTypes.map((option, index) => (
            <RadioGroupOption
              {...option}
              key={index}
              onClick={() => setType(option.value)}
              active={option.value === type}
            />
          ))}
        </RadioGroupWrapper>
      </InputWrapper>
      <InputWrapper>
        <Label>Category</Label>
        <SelectWrapper>
          <Input
            {...register("category", {
              required: "Category is required",
            })}
            type="select"
            as="select"
            defaultValue={categories[0]}
          >
            {categories.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </Input>
        </SelectWrapper>
        <Error>{errors.category?.message}</Error>
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
      <InputWrapper>
        <Label>Flow rate in wei</Label>
        <Input
          {...register("flowrate", {
            required: "The flow rate is required",
            onChange: (e) => {
              handleFlowRateChange(e.target.value);
            },
          })}
          type="text"
          placeholder="flowrate"
        />
        <p style={{ color: "#898989", fontSize: "12px" }}>
          Your flow will be equal to: {"  "}
          <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b>
          {"  "}
          DAIx/month
        </p>
        <Error>{errors.flowrate?.message}</Error>
      </InputWrapper>
      {type === "link" && (
        <InputWrapper>
          <Label>url</Label>
          <Input
            {...register("url", {
              validate: (value) => {
                return isURL(value) || "Provid a valid url";
              },
            })}
            placeholder="url"
          />
          <Error>{errors.url?.message}</Error>
        </InputWrapper>
      )}
      {type === "text" && (
        <InputWrapper>
          <Label>text</Label>
          <Input
            {...register("text", {
              required: "Text is required",
              minLength: {
                value: 5,
                message: "Text musst be at least 5 characters",
              },
              maxLength: {
                value: 10000,
                message: "Text musst be under 10.000 characters",
              },
            })}
            placeholder="text"
            as="textarea"
            rows="6"
          />
          <Error>{errors.text?.message}</Error>
        </InputWrapper>
      )}
      <SubmitButton type="submit">create proposal</SubmitButton>
    </Form>
  );
}
