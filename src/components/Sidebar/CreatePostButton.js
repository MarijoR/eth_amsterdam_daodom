import Button from "components/shared/Button";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const CreatePostButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 8px;
  text-decoration: none;
  text-align: center;
`;

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
  border-radius: 2px 2px 0 0;
  padding: 10px;
  text-decoration: none;
  text-align: center;
  justify-content: center;
`;



export default function SidebarCreatePostButton() {
  return (
    <div className="post_container">
    <CreatePostButton as={Link} to="/createpost">
      create proposal
    </CreatePostButton>
     <CreateBlogButton as={Link} to="/HomeAuth">
      create blog
    </CreateBlogButton> 
    <CreateBlogButton as={Link} to="/createblog">
      create blog via IPFS 
    </CreateBlogButton> 
    </div>
  );
}

//Uffi ipfs