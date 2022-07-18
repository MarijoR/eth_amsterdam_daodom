import { useEffect, useState } from "react";
import "../styles/MyBlogs.css";
import axios from "axios";
import BlogCard from "../components/BlogCard"
import { Button } from "web3uikit";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

const MyBlogs = () => {

  const Web3Api = useMoralisWeb3Api();
  const { isInitialized, isAuthenticated, account } = useMoralis();
  // const navigate = Link(); //FALSCH 
  const [blogs, setBlogs] = useState();
  //das hier war zwischen den Klammern bei blogs, hard gecodet
  //   [
  //   {externalUrl:"https://ipfs.io/ipfs/Qmd7DuscoYu3bqBavGxcxvoR1yZDhp8B4sNncyorZphucM",
  //   // {externalUrl:"https://ipfs.moralis.io:2053/ipfs/QmaC9bPFJwpvM48drqsWGMLVeDHQMpibBqzNsD5RVAh7hz/Goku_637906479457969000.json",
  //    owner_of:"Ufuk Ahmetoglu",
  //   }
  // ]
  
  const [blogsContent, setBlogsContent] = useState();

  const fetchAllNfts = async () => {

    const options = {
      chain: "mumbai",
      address: account,
      token_address: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
    };

    const polygonNFTs = await Web3Api.account.getNFTsForContract(options);
    const tokenUri = polygonNFTs?.result?.map((data) => {
      const { metadata, owner_of } = data;

      if (metadata) {
        const metadataObj = JSON.parse(metadata);
        const { externalUrl } = metadataObj;
        return { externalUrl, owner_of };
      } else {
        return undefined;
      }
    });
    setBlogs(tokenUri);
    
  };

  const fetchBlogsContent = async () => {

    const limit5 = blogs?.slice(0, 5);
    let contentBlog = [];

    if (limit5) {
      limit5.map(async (blog) => {
        if (blog) {
          const { externalUrl, owner_of } = blog;
          const res = await axios.get(externalUrl);
          const text = res.data.text.toString();
          // const name = res.data.text.toString();
          const title = res.data.title;
          // const description = res.data.description;
          contentBlog.push({ title, text, owner_of, externalUrl });
          // contentBlog.push({ name, description, owner_of, externalUrl });
        }
      });
    }
    setBlogsContent(contentBlog);
    
  }

  useEffect(() => {
    if (blogs && !blogsContent) {
      fetchBlogsContent();
    }
  }, [blogs, blogsContent]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchAllNfts();
    } 
  }, [isAuthenticated, isInitialized, account]);

  let history = useHistory();

  const clickHandler = () => {
    // navigate("/newStory");
    // <Link to={("/newStory")}></Link>
    //  <Redirect to="/newStory" />
    history.push("/newStory");
  };

  //neu hinzugefügt: (rerendering)
  const [nfts, setNfts] = useState()

  useEffect(() => {
    const options2 = {
      chain: "mumbai",
      address: account,
      token_address: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
    };
    const test = async () => {
      // await Moralis.Web3API.account.getNFTs({ ... })
      await Web3Api.account.getNFTsForContract(options2)
        .then((data) => setNfts(data.result))
    }
    test()
  })
 

  return (
    <>
      <div>
      <div className="myBlogsHeader">Your Blogs</div>
        { nfts && blogsContent && blogsContent?.length > 0 ? (
            blogsContent.map((blog, i) => {
              const { title, text, owner_of, externalUrl } = blog;
              return (
                <BlogCard
                  key={i}
                  title={title}
                  text={text}
                  ownerOf={owner_of}
                  externalUrl={externalUrl}
                />
              );
            })
        ) : (
          <div
          style={{
            fontSize: "30px",
            width: "100%",
            marginLeft: "40%",
          }}
        >
          <p>No Blogs Yet</p>
          <Button text="Create one" onClick= {clickHandler} />
        </div>
        )}
      </div>
    </>
  );
};

export default MyBlogs;

//Uffi ipfs