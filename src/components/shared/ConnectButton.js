import styled from "styled-components/macro";
import { link } from "./helpers";

const Button = styled.button`
  ${link};

  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 13px;
  color: ${(props) => props.theme.normalText};
  margin-left: auto;
`;

const ConnectButton = (props) => <Button onClick={props.onClick}>Connect Wallet</Button>;

export default ConnectButton;
