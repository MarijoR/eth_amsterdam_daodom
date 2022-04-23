import CommentListItem from "components/CommentList/Item";
import styled from "styled-components/macro";

const List = styled.ul`
  margin-top: 16px;
  list-style: none;
`;

export default function CommentList({ comments }) {
  return (
    <List>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </List>
  );
}
