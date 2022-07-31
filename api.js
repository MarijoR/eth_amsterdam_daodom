import { createClient } from "urql";

const APIURL = "https://api.lens.dev";

export const client = new createClient({
  url: APIURL,
});

export const createProfil = `
mutation CreateProfile {
  createProfile(request:{ 
                handle: "devjoshstevens",
                profilePictureUri: null,
                followNFTURI: null,
                followModule: null
                }) {
    ... on RelayerResult {
      txHash
    }
    ... on RelayError {
      reason
    }
    __typename
  }
}
`;
