import { videonft } from "@livepeer/video-nft";


const apiOpts = {
    auth: { apiKey: "c8fb2455-5f4f-4a8f-84fb-53005c480f90"},
    endpoint: videonft.api.prodApiEndpoint,
}

export const mint = async(chainId, title, nftMetadata, setAppState, setMessage, setNftInfo) => {
    const { ethereum } = window
    const minter = new videonft.minter.FullMinter(apiOpts, { ethereum, chainId});
    const file = await minter.uploader.pickFile();

    //Todo: update app state
    setAppState("Minting")
    setMessage("Creating asset")
    let asset = await minter.api.createAsset(title, file);
    setMessage("Export to IPFS")
    const ipfs = await minter.api.exportToIPFS(asset.id, nftMetadata);
    setMessage("Minting NFT")
    const tx = await minter.web3.mintNft(ipfs.nftMetadataUrl);
    setMessage("Getting NFT Info")
    const nftInfo = await minter.web3.getMintedNftInfo(tx);
    setNftInfo({...nftInfo, ...ipfs})
    setAppState("Minted")
    return nftInfo
}