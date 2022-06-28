import { useState } from "react";
import "../styles/NewStory.css"
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";

const NewStory = () => {

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { saveFile } = useMoralisFile();
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const mint = async (account, uri) => {

    let options ={
      contractAddress: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
      functionName: "safeMint",
      abi: [
        {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"payable","type":"function",},
      ],
      params: {
        to: account,
        uri: uri,
      },
      msgValue: Moralis.Units.ETH(0.000001),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        alert("Succesful Mint");
        setText("");
        setTitle("");
      },
      onError: (error) => {
        alert(error.message);
      },
    });

  }


  const uploadFile = async (event) => {
    event.preventDefault();
    const textArray = text.split();
    const metadata = {
      title,
      text: textArray,
    };

    try {
      const result = await saveFile(
        "myblog.json",
        { base64: btoa(JSON.stringify(metadata)) },
        {
          type: "base64",
          saveIPFS: true,
        }
      );
      // alert(result.ipfs());
      //jetzt wird alert als function genutzt
      const nftResult = await uploadNftMetada(result.ipfs());
      // alert(nftResult.ipfs()) 
      await mint(account, nftResult.ipfs());
    } catch (error) {
      alert(error.message);
    }

  }

  const uploadNftMetada = async (url) => {
    const metadataNft = {
      image:
        "https://ipfs.moralis.io:2053/ipfs/QmXaRnHiDJGZuqSTKFU1aNcSiyRWJmAJGA4Koo3yrgJqMz/Goku",
      description: title,
      externalUrl: url,
    };
    const resultNft = await saveFile(
      "metadata.json",
      { base64: btoa(JSON.stringify(metadataNft)) },
      {
        type: "base64",
        saveIPFS: true,
      }
    );
    return resultNft;
  };

      
  return (
    <>
    <div>
      <form onSubmit={uploadFile} className="writeForm">
        <div className="writeFormGroup">
        <input
            className="writeInput"
            placeholder="Title"
            type="text"
            autoFocus={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
        <textarea
            className="writeInput writeText"
            placeholder="Tell your story..."
            autoFocus={true}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
</>
);
};

export default NewStory;
