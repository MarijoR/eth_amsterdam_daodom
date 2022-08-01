import CategoryMenu from "components/CategoryMenu";
import Post from "components/Post";
import Sidebar from "components/Sidebar";
import { Route } from "react-router-dom";
import styled from "styled-components/macro";
import PostDetail from "./PostDetail";
import PostDetailsIPFS from "./PostDetailsIPFS";
import PostList from "./PostList";
import PostListIPFS from "./PostListIPFS";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 10vw;

  @media (max-width: 1024px) {
    margin: 0 5vw;
  }

  @media (max-width: 768px) {
    display: block;
    margin: 0;
  }
`;

const HomeMainSection = styled.main`
  flex: 1;
  min-width: 0;
`;

export default function HomeIPFS() {
  return (
    <Wrapper>
      <HomeMainSection>
        <Route component={CategoryMenu} />
        <Route exact path='/' component={PostList} />
        <Route exact path='/a/:category' component={PostList} />
        <Route exact path='/u/:username' component={PostList} />
        <Route exact path='/a/:category/:postId' component={PostDetailsIPFS} />
      </HomeMainSection>
        <Route component={Sidebar} />
    </Wrapper>

  )
}
