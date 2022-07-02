import Button from "components/shared/Button";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const CreatePostButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 8px;
  text-decoration: none;
  text-align: center;
`;

const CreateBlogButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 8px;
  text-decoration: none;
  text-align: center;
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
    </div>
  );
}

//Uffi ipfs