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

import Button from "components/shared/Button";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

//IPFS
import "../styles/NewStory.css"
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";

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

export default function CreateBlog({ history }) {
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

  //IPFS 
// const NewStory = () => {

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [Address, setAddress] = useState("");
  const [Flowrate, setFlowrate] = useState("");
  const [Category, setCategory] = useState("");
  const [Url, setUrl] = useState("");
  const { saveFile } = useMoralisFile();
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const mint = async (account, uri) => {

    let options ={
      contractAddress: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
      functionName: "safeMint",
      abi: [
        {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"payable","type":"function",},
      ],
      params: {
        to: account,
        uri: uri,
      },
      msgValue: Moralis.Units.ETH(0.000001),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        alert("Succesful Mint");
        setCategory("");
        setTitle("");
        setAddress("");
        setFlowrate("");
        setText("");
        setUrl("");
      },
      onError: (error) => {
        alert(error.message);
      },
    });

  }

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  const dateToFormat = '1976-04-19';

  const uploadFile = async (event) => {
    event.preventDefault();
    const textArray = text.split();
    const metadata = {
    //   title,
    //   text: textArray,
    Category,
    title,
    Address,
    Flowrate,
    Url,
    text: textArray,
    time: date,
    };

    try {
      const result = await saveFile(
        "myblog.json",
        { base64: btoa(JSON.stringify(metadata)) },
        {
          type: "base64",
          saveIPFS: true,
        }
      );
      // alert(result.ipfs());
      //jetzt wird alert als function genutzt
      const nftResult = await uploadNftMetada(result.ipfs());
      // alert(nftResult.ipfs()) 
      await mint(account, nftResult.ipfs());
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }

  }

  const uploadNftMetada = async (url) => {
    const metadataNft = {
      image:
        "https://ipfs.moralis.io:2053/ipfs/QmXaRnHiDJGZuqSTKFU1aNcSiyRWJmAJGA4Koo3yrgJqMz/Goku",
      description: title,
      externalUrl: url,
    };
    const resultNft = await saveFile(
      "metadata.json",
      { base64: btoa(JSON.stringify(metadataNft)) },
      {
        type: "base64",
        saveIPFS: true,
      }
    );
    return resultNft;
  };

  const CreateBlogButton = styled(Button)
//das hier ist die Version zusammen mit dem oberen
// `
//   border-radius: 2px 2px 0 0;
//   padding: 8px;
//   text-decoration: none;
//   text-align: center;
// `;

//das hier ist die Version als alleiniger Button
`
display: flex;
  border-radius: 8px 8px 8 8;
  padding: 8px;
  text-decoration: none;
  text-align: center;
  justify-content: center;
`;

  return (
    <Form 
    onSubmit={uploadFile}
    // onSubmit={handleSubmit(onSubmit)} wide
    >
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
            onChange={(e) => setCategory(e.target.value)}
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
          onChange={(e) => setTitle(e.target.value)}
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
          onChange={(e) => setAddress(e.target.value)}
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
          onChange={(e) => setFlowrate(e.target.value)}
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
            onChange={(e) => setUrl(e.target.value)}
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
            onChange={(e) => setText(e.target.value)}
          />
          <Error>{errors.text?.message}</Error>
        </InputWrapper>
      )}
      <SubmitButton type="submit">create ipfs blog</SubmitButton>
      <CreateBlogButton
      style={{alignSelf: "flex-end", marginTop: 15,}}
      as={Link} to="/postlistipfs">
  view all blogs 
</CreateBlogButton> 
    </Form>
  );
}
// }
