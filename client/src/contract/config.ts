import abiLCKToken from './abis/lckToken.json';
import abiProduct from './abis/product.json'
import { ethers } from "ethers";

export const LCK_TOKEN_ADDRESS: string = process.env.REACT_APP_TOKEN || '';
export const PRODUCT_ADDRESS: string = process.env.REACT_APP_PRODUCT || '';
export const getAbiLCKToken = () => abiLCKToken;
export const getAbiProduct = () => abiProduct;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PUBLIC_RPC_TESTNET);