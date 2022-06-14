import CommentForm from "components/CommentForm";
import CommentList from "components/CommentList";
import Post from "components/Post";
import DeleteButton from "components/shared/DeleteButton";
import ConnectButton from "components/shared/ConnectButton";
import StreamButton from "components/shared/StreamButton";
import UpdateStreamButton from "components/shared/UpdateStreamButton";
import DeleteStreamButton from "components/shared/DeleteStreamButton";
import Empty from "components/shared/Empty";
import LoadingIndicatorBox from "components/shared/LoadingIndicator/Box";
import { deletePost, getCommentsByPostId, getPost } from "lib/firebase";
import { usePostViewCount } from "lib/hooks";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router";
import useStore from "store";
import styled from "styled-components/macro";

import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button, Spinner, Card } from "react-bootstrap";
import "../components/SuperFluid/createFlow.css";
import { ethers } from "ethers";

const Wrapper = styled.div`
  display: flex;
  margin-top: -1px;
  border: 1px solid ${(props) => props.theme.border};
  ${(props) => props.round && "border-radius: 0 0 2px 2px"};
  padding: 8px;
  background-color: ${(props) => props.theme.foreground};
  font-size: 13px;
  color: ${(props) => props.theme.mutedText};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
  }
`;

const PostWrapper = styled.div`
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 2px 2px 0 0;

  @media (max-width: 768px) {
    margin-bottom: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

async function createNewFlow(recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: recipient,
      flowRate: flowRate,
      superToken: DAIx,
      // userData?: string
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function updateExistingFlow(recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  console.log("Hi: ", signer);

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;

  try {
    const updateFlowOperation = sf.cfaV1.updateFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: DAIx,
      // userData?: string
    });
    const result = await updateFlowOperation.exec(signer);
    console.log(result);
    console.log("Congrats - you've just updated a money stream!");
  } catch (error) {
    console.error(error);
  }
}

async function deleteFlow(currentAccount, recipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: currentAccount,
      receiver: recipient,
      superToken: DAIx,
      // userData?: string
    });

    await deleteFlowOperation.exec(signer);
  } catch (error) {
    console.error(error);
  }
}

export default function PostDetail() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [recipient, setRecipient] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const { postId } = useParams();
  usePostViewCount(postId);
  const user = useStore((s) => s.user);
  const { data: post, isLoading } = useQuery(["post", postId], () =>
    getPost(postId)
  );

  if (isLoading) return <LoadingIndicatorBox />;
  if (!post) return <Empty />;

  return (
    <>
      <PostDetailPost post={post} />
      <ContractDefinition postId={postId} post={post} user={user} />
      <UpdateStream postId={postId} post={post} user={user} />
      <PostDetailInfoBar postId={postId} post={post} user={user} />
      {user && <CommentForm postId={postId} />}
      <PostDetailCommentSection postId={postId} />
    </>
  );
  function PostDetailPost({ post }) {
    return (
      <PostWrapper>
        <Post post={post} full />
      </PostWrapper>
    );
  }

  function ContractDefinition({ user, postId, post }) {
    const { author, address, flowrate } = post;
    const history = useHistory();
    setFlowRate(flowrate);
    setRecipient(address);

    const mutation = useMutation(deletePost, {
      onSuccess: () => {
        history.replace("/");
        toast.success("Post deleted");
      },
    });

    const amountInWei = ethers.BigNumber.from(flowrate);
    const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
    const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
    setFlowRateDisplay(calculatedFlowRate);

    const isAuthor = author.uid === user?.uid;

    return (
      <Wrapper round={!user}>
        <span>
          <p>Recipient: {address}</p>
          <p>Flow Rate: {flowrate}</p>
          <p>This flow is equal to: {flowRateDisplay} DAIx/month</p>
        </span>
        {/* {isAuthor && <DeleteButton onClick={() => mutation.mutate(postId)} />} */}
        <StreamButton
          onClick={() => {
            setIsButtonLoading(true);
            createNewFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        />
        <UpdateStreamButton
          onClick={() => {
            setIsButtonLoading(true);
            updateExistingFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        />
        <DeleteStreamButton
          onClick={() => {
            setIsButtonLoading(true);
            deleteFlow(currentAccount, recipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        />
      </Wrapper>
    );
  }

  function UpdateStream({ user, postId, post }) {
    const { author, address, flowrate } = post;
    const history = useHistory();
    setFlowRate(flowrate);
    setRecipient(address);

    const mutation = useMutation(deletePost, {
      onSuccess: () => {
        history.replace("/");
        toast.success("Post deleted");
      },
    });

    const isAuthor = author.uid === user?.uid;

    if (
      typeof Number(flowrate) !== "number" ||
      isNaN(Number(flowrate)) === true
    ) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(flowrate) === "number") {
      if (Number(flowrate) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(flowrate);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      setFlowRateDisplay(calculatedFlowRate);
    }

    return (
      <Wrapper round={!user}>
        <span>Your flow will be equal to: {flowRateDisplay} DAIx/month</span>
      </Wrapper>
    );
  }

  function PostDetailInfoBar({ user, postId, post }) {
    const { author, views, upvotePercentage } = post;
    const history = useHistory();
    const mutation = useMutation(deletePost, {
      onSuccess: () => {
        history.replace("/");
        toast.success("Post deleted");
      },
    });

    function CreateButton({ isLoading, children, ...props }) {
      return (
        <Button variant="success" className="button" {...props}>
          {isButtonLoading ? <Spinner animation="border" /> : children}
        </Button>
      );
    }

    const isAuthor = author.uid === user?.uid;

    return (
      <Wrapper round={!user}>
        <span>{views} views</span>
        <span>&nbsp;|&nbsp;</span>
        <span>{upvotePercentage}% upvoted</span>
        {/* {isAuthor && <DeleteButton onClick={() => mutation.mutate(postId)} />} */}
        {currentAccount === "" ? (
          <ConnectButton onClick={connectWallet} />
        ) : (
          <Card className="connectedWallet">
            {`${currentAccount.substring(0, 5)}...${currentAccount.substring(
              38
            )}`}
          </Card>
        )}
      </Wrapper>
    );
  }

  function PostDetailCommentSection({ postId }) {
    const { data: comments, isLoading } = useQuery(["comments", postId], () =>
      getCommentsByPostId(postId)
    );

    if (isLoading || !comments?.length) return <Empty comments />;
    return <CommentList comments={comments} />;
  }
}
