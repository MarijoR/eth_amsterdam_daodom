import Post from "components/Post";
import Empty from "components/shared/Empty";
import LoadingIndicatorBox from "components/shared/LoadingIndicator/Box";
import { getPosts, getPostsByCategory, getPostsByUsername } from "lib/firebase";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { useState, useEffect } from "react";
import "../styles/HomeAuth.css"
import axios from "axios";
import BlogCard from "../components/BlogCard"
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

const List = styled.ul`
  list-style: none;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 2px;

  @media (max-width: 768px) {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

const Item = styled.li`
  :not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.border};
  }
`;


export default function PostListIPFS({ text, title, Category, Address, Flowrate, Url, time, ownerOf, externalUrl }) {
  // const { username, category } = useParams()
  // const { data: posts, isLoading } = useQuery(["posts", username, category], () => {
  //   return username 
  //   ? getPostsByUsername(username) 
  //   : category 
  //   ? getPostsByCategory(category) 
  //   : getPosts();
  // })



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
          const Category = res.data.Category;
          const Address = res.data.Address;
          const Flowrate = res.data.Flowrate;
          const Url = res.data.Url;
          const time = res.data.time;
          // const description = res.data.description;
          contentBlog.push({ title, text,  Category, Address, Flowrate, Url, time, owner_of, externalUrl  });
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



  // if(isLoading) return <LoadingIndicatorBox />;
  // if(!posts || !posts.length) return <Empty />


  //vorheriger return 
//   return (<List>
//     { nfts && 
//       blogsContent &&
//       blogsContent.map((blog, i) => {
//         // const { title, text,  Category, Address, Flowrate, Url, time, owner_of, externalUrl } = blog; //vielleicht auch mal mit post probieren?
//         const { title } = blog; //vielleicht auch mal mit post probieren?
//         // const { title, text, owner_of, externalUrl } = post;
//         return (
//           //PostListItem funzt hier nicht?? Check das Frontend hier nicht (BlogCard geht)
//         <PostListItem
//         key={i}
//                 title={title}
//                 // text={text}
//                 // Category={Category}
//                 // Address={Address}
//                 // Flowrate={Flowrate}
//                 // Url={Url}
//                 // time={time}
//                 // ownerOf={owner_of}
//                 // externalUrl={externalUrl}
//               />
//             );
//           })}
//     {posts.map(post => (
//       <PostListItem 
//       key={post.id} post={post} />
//     ))}
//   </List>
//   )
// }


//nochmal return Versuch
// return (<List>
//   {blogsContent.map(blog => (
//      <PostListItem>Title: {title}</PostListItem> 
//     // <PostListItem key= {blog.id} title= {title} >
//    ))} 
// </List>
// )
// }



// return (<List>
//   {posts.map(blogsContent => (
//     <PostListItem {...blogsContent[0].title} />
//   ))}
// </List>
// )
// }




// function PostListItem({ blogsContent }) {
//   return (
//     <Item>
//       <Post {...blogsContent[0].title} />
//     </Item>
//   )
// }

// function PostListItem({ text }) {
//   return (
//     <Item>
//       <Post text={text} full={true} />
//     </Item>
//   )
// }


//nochmal return um zu checken (funktioniert)
return (
  <div className="homeAuth_container">
    <div className="homeAuth_header">All IPFS Blogs</div>
    <div className="homeAuth_blogs">
      { 
      nfts && 
      blogsContent &&
        blogsContent.map((blog, i) => {
          // const { title, text, owner_of, externalUrl } = blog;
          // const { name, description, owner_of, externalUrl } = blog;
          const { title, text,  Category, Address, Flowrate, Url, time, owner_of, externalUrl } = blog;
          return (
            <BlogCard
              key={i}
              title={title}
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
