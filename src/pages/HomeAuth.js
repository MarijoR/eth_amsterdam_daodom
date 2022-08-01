import { useState, useEffect } from "react";
import "../styles/HomeAuth.css"
import axios from "axios";
import BlogCard from "../components/BlogCard"
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

const HomeAuth = () => {

  //neu hinzugefügt: (rerendering)
  const { account } = useMoralis();

  //für externalUrl siehe constants.js
  //vorher war zwischen den Klammern bei blogs das hier
   // {externalUrl:"https://ipfs.moralis.io:2053/ipfs/QmZEAjVpQSC6onTaLe1pxWA3eA9kgwX1YPkxhPZ694P2pt",
    // // // {externalUrl:"https://ipfs.moralis.io:2053/ipfs/QmaC9bPFJwpvM48drqsWGMLVeDHQMpibBqzNsD5RVAh7hz/Goku_637906479457969000.json",
    //  owner_of:"Ufuk Ahmetoglu",
    // }
    const [blogs, setBlogs] = useState();
    const [blogsContent, setBlogsContent] = useState();
    const Web3Api = useMoralisWeb3Api();

  const fetchAllNfts = async () => {

    const options = {
      chain: "mumbai",
      address: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
    };

    const polygonNFTs = await Web3Api.token.getNFTOwners(options);
    const tokenUri = polygonNFTs?.result?.map((data) => {
      const { metadata, owner_of } = data;

      if (metadata) {
        const metadataObj = JSON.parse(metadata);
        const { externalUrl } = metadataObj;
        const { text } = metadataObj;
        return { externalUrl, owner_of, text };
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
          const { externalUrl, owner_of, } = blog;
          const res = await axios.get(externalUrl);
          const text = res.data.text.toString();
          // const name = res.data.text.toString();
          const title = res.data.title;
          // const description = res.data.description;
          const Category = res.data.Category;
          const Address = res.data.Address;
          const Flowrate = res.data.Flowrate;
          const Url = res.data.Url;
          const time = res.data.time;
          // contentBlog.push({ title, text, owner_of, externalUrl });
          // contentBlog.push({ name, description, owner_of, externalUrl });
          contentBlog.push({ title, text,  Category, Address, Flowrate, Url, time, owner_of, externalUrl  });
        }
      });
    }
    setBlogsContent(contentBlog);
  }

  // console.log(blogsContent)
  // console.log(blogsContent[1].title)
  // console.log("Text in line 4", blogsContent[4].text)
  // console.log(blogs)

  useEffect(() => {
    if (blogs && !blogsContent) {
      fetchBlogsContent();
    }
  }, [blogs, blogsContent]); //vorher wars ohne blogs, blogsContent

  useEffect(() => {
    if (!blogs) {
      fetchAllNfts();
    }
  }, [blogs]);

  //neu hinzugefügt:
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
    <div className="homeAuth_container">
      <div className="homeAuth_header">View All User-Blogs</div>
      {/* {nfts && blogsContent && <div>Text: {blogsContent[1].title}</div>} */}
      {/* {nfts && blogsContent && <div>Text: {blogsContent[1].text}</div>} */}
      <div className="homeAuth_blogs">
        { nfts && blogsContent && 
          blogsContent.map((blog, i) => {
            // const { title, text, owner_of, externalUrl } = blog;
            // const { name, description, owner_of, externalUrl } = blog;
            const { title, text,  Category, Address, Flowrate, Url, time, owner_of, externalUrl } = blog;
            return (
              <BlogCard
                key={i}
                // title={title}
                title={blog.title} //kann man auch so schreiben
                text={text}
                Category={Category}
                Address={Address}
                Flowrate={Flowrate}
                Url={Url}
                time={time}
                // name={name}
                // description={description}
                ownerOf={owner_of}
                externalUrl={externalUrl}
              />
            );
          })}
      </div>
    </div>
  );

  
};

export default HomeAuth;

//Uffi ipfs