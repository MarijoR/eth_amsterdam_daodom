import CommentContent from "components/CommentList/Content";
import CommentDetail from "components/CommentList/Detail";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  margin-bottom: 8px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 2px;
  background-color: ${(props) => props.theme.foreground};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

export default function CommentListItem({ comment }) {
  const { body, ...details } = comment;

  return (
    <Wrapper>
      <CommentDetail {...details} />
      <CommentContent>{body}</CommentContent>
    </Wrapper>
  );
}
