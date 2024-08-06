import React from 'react'
import Header from './Header'

const BackgroundShop = ({ connectWallet, address, web3Provider }) => {
   return (
      <div className='relative w-full h-[570px] flex flex-col items-center'>
         <div className='-z-10 absolute top-0 left-0 w-full h-full bg-background-shop bg-cover opacity-90' />
         <div className='-z-10 absolute top-0 left-0 w-full h-full bg-black bg-cover opacity-50' />
         <div className='w-full mt-12 flex items-center justify-center'>
            <Header connectWallet={connectWallet} address={address} web3Provider={web3Provider} />
         </div>
         <h3 className='absolute top-[50%] left-[50%] text-white font-bold text-4xl'>SHOP</h3>
      </div>
   )
}

export default BackgroundShop