import "../styles/BlogCard.css";
// import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

const BlogCard = ({ text, title, ownerOf, externalUrl }) => {
  // const BlogCard = ({ name, description, ownerOf, externalUrl }) => {
  
  const length = 100;
  const trimmedString = text.length > 100 ? 
    text.substring(0, length) : 
    text;

    // const length = 100;
    // const trimmedString = name.length > 100 ? 
    //   name.substring(0, length) : 
    //   name;

  const account = `${ownerOf.slice(0, 4)}...${ownerOf.slice(38)}`;

  const navigate = Link();

  //Achtung hier davor "/" -> HomeAuth.js
  const clickHandler = () => {
    const lastSegment = externalUrl.split("/HomeAuth").pop();
    navigate(`/blog/${lastSegment}`);
    // {Link} to=(`/blog/${lastSegment}`);
  };

  return (
    <div className="blog" onClick={clickHandler}>
      <div className="blog_leftSide">
      <div className="blogger">
          <span className="blogger_name">{account}</span>
          <span className="blogger_date">Mar 21</span>
      </div>
      <div className="blog_title">
          <h3>{title}</h3>
      </div>
      <div className="blog_content">
          <p>{trimmedString}...</p>
      </div>
      </div>
      <div className="blog_rightSide">
        <div>
          <img
            className="blog_image"
            // src="https://ipfs.moralis.io:2053/ipfs/QmWEsG4ayh75BMk2H1CowAdALPjsi3fD7CSZ6qxNM1yNnz/image/moralis.png"
            src="https://ipfs.moralis.io:2053/ipfs/QmXaRnHiDJGZuqSTKFU1aNcSiyRWJmAJGA4Koo3yrgJqMz/Goku"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

//Uffi ipfs