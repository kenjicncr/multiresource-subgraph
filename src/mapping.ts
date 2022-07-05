import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  log,
  Value,
} from "@graphprotocol/graph-ts";
import { MintCall, Mint136Call, Transfer } from "./types/MultiResource/abi";
import { MultiResourceNFT } from "./types/schema";

export function handleItemTransferred(event: Transfer): void {
  let originAddress: Address = event.params.from;
  let owner: Address = event.params.to;
  let price: BigInt = event.transaction.value;
  let timestamp: BigInt = event.block.timestamp;
  let txHash: string = event.transaction.hash.toHex();
  let tokenId: BigInt = event.params.tokenId;

  let nft = MultiResourceNFT.load(txHash);

  if (nft === null) {
    nft = new MultiResourceNFT(txHash);
    nft.tokenId = tokenId;
    nft.id = tokenId.toString();
    nft.previousOwner = originAddress;
    nft.owner = owner;
    nft.save();
  } else {
    nft.previousOwner = originAddress;
    nft.owner = owner;
    nft.save();
  }
}

export function handleMint(call: MintCall): void {
  let txHash: string = call.transaction.hash.toHex();
  let aNum: BigInt = call.inputs.aNum;
  let bNum: BigInt = call.inputs.bNum;
  let cNum: BigInt = call.inputs.cNum;
  let dNum: BigInt = call.inputs.dNum;
  let value: BigInt = call.transaction.value;
  let nft = MultiResourceNFT.load(txHash);

  // very dirty and doesn't account for multiple mints
  const getPosterSet = (): BigInt => {
    if (!aNum.isZero) {
      return new BigInt(0);
    }

    if (!bNum.isZero) {
      return new BigInt(1);
    }

    if (!cNum.isZero) {
      return new BigInt(2);
    }

    if (!dNum.isZero) {
      return new BigInt(3);
    }

    return new BigInt(4);
  };

  let posterSet: BigInt = getPosterSet();

  if (nft === null) {
    nft = new MultiResourceNFT(txHash);
    nft.posterSet = posterSet.toI32();
    nft.save();
  }
}
