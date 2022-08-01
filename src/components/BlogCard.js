import "../styles/BlogCard.css";
// import { useNavigate } from "react-router-dom"; 
import { Link, useHistory } from "react-router-dom";

//neu
import React from "react";
import Moment from "moment";

const BlogCard = ({ text, title, Category, Address, Flowrate, Url, time, ownerOf, externalUrl }) => {
  // const BlogCard = ({ name, description, ownerOf, externalUrl }) => {

    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const dateToFormat = '1976-04-19';
  
  const length = 100;
  const trimmedString = text.length > 100 ? 
    text.substring(0, length) : 
    text;

    // const length = 100;
    // const trimmedString = name.length > 100 ? 
    //   name.substring(0, length) : 
    //   name;

  const account = `${ownerOf.slice(0, 4)}...${ownerOf.slice(38)}`;

  // const navigate = Link();

  const history = useHistory();
  //Achtung hier war davor "/" -> ich hab "/" ->  /HomeAuth.js genannt, ist aber trotzdem so richtig:
  const clickHandler = () => {
    const lastSegment = externalUrl.split("/").pop();
    // navigate(`/blog/${lastSegment}`);
    // <Link to={(`/blog/${lastSegment}`)}></Link>
    history.push(`/blog/${lastSegment}`);
  };

  return (
    <div className="blog" onClick={clickHandler}>
      <div className="blog_leftSide">
      <div className="blogger">
          <span className="blogger_name">{account}</span>
          {/* <Moment> */}
             <span className="blogger_date">date: {date} </span>
          {/* </Moment> */}
      </div>
      <div className="blog_title">
          <h3>Title: {title}</h3>
      </div>
      <div className="blog_content">
          <p>Text: {trimmedString}...</p>
          <p>Category: {Category}</p>
          <p>Flowrate: {Flowrate}</p>
          <p>Eth-Address: {Address}</p>
          <p>Date: {time}</p>
      </div>
      </div>
      <div className="blog_rightSide">
        <div>
          <img
            className="blog_image"
            // src="https://ipfs.moralis.io:2053/ipfs/QmWEsG4ayh75BMk2H1CowAdALPjsi3fD7CSZ6qxNM1yNnz/image/moralis.png"
            // src="https://ipfs.moralis.io:2053/ipfs/QmXaRnHiDJGZuqSTKFU1aNcSiyRWJmAJGA4Koo3yrgJqMz/Goku"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

//Uffi ipfs