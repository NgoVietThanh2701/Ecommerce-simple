import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import BackgroundShop from '../components/BackgroundShop'
import Footer from '../components/Footer';
import { ethers } from 'ethers';

const Layout = () => {

   const [web3Provider, setWeb3Provider] = useState();
   const [address, setAddress] = useState('');
   const [balance, setBalance] = useState(0);

   // const getBalance = async () => {
   //    if (web3Provider && address) {
   //       const lckContract = new LCKContract(web3Provider);
   //       const balanceOfAccount = await lckContract.balanceOf(address);
   //       setBalance(balanceOfAccount);
   //    }
   // }

   useEffect(() => {
      if (address) {
         //getBalance(); // Gọi getBalance khi component mount và có địa chỉ ví
      }
   }, [address]);

   const connectWallet = async (requestAccess = false) => {
      if (window.ethereum) {
         try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            let accounts;
            if (requestAccess) {
               accounts = await provider.send("eth_requestAccounts", []);
            } else {
               accounts = await provider.send("eth_accounts", []);
            }
            if (accounts.length > 0) {
               const signer = provider.getSigner();
               const address = await signer.getAddress();
               setWeb3Provider(provider);
               setAddress(address);
               localStorage.setItem("isWaletConnected", "true");
            } else {
               localStorage.removeItem("isWaletConnected");
            }
         } catch (error) {
            console.log(error);
            localStorage.removeItem("isWaletConnected");
         }
      }
   };

   /* Check connect Wallet. If connected -> getAccount. Else -> request connect*/
   useEffect(() => {
      if (localStorage.getItem("isWaletConnected") === "true") {
         connectWallet(false);
      }
   }, []);

   useEffect(() => {
      const handleAccountsChanged = async (accounts) => {
         if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWeb3Provider(provider);
            setAddress(address);
         } else {
            setWeb3Provider(null);
            setAddress("");
            setBalance(0);
            localStorage.removeItem("isWaletConnected");
         }
      };

      const handleDisconnect = () => {
         setWeb3Provider(null);
         setAddress("");
         setBalance(0);
         localStorage.removeItem("isWaletConnected");
      };

      if (window.ethereum) {
         window.ethereum.on("accountsChanged", handleAccountsChanged);
         window.ethereum.on("disconnect", handleDisconnect);
      }

      return () => {
         if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("disconnect", handleDisconnect);
         }
      };
   }, []);

   useEffect(() => {
      const handleBlock = () => {
         // getBalance(); // Gọi getBalance để cập nhật số dư khi có block mới
      };
      if (web3Provider) {
         const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
         provider.on("block", handleBlock);

         return () => {
            provider.removeListener("block", handleBlock); // Loại bỏ listener khi component bị unmount
         };
      }
   }, [web3Provider]);

   return (
      <div className='font-rubik w-full flex flex-col items-center'>
         <BackgroundShop connectWallet={connectWallet} address={address} web3Provider={web3Provider} />
         <Outlet context={{ web3Provider, address }} />
         <div className='w-full border border-gray-200 border-color mt-10' />
         <Footer />
      </div>
   )
}

export default Layout