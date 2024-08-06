import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LiaGripfire } from 'react-icons/lia';
import { IoSearchSharp } from "react-icons/io5";
import AddProduct from '../page/AddProduct';

const Header = ({ connectWallet, address, web3Provider }) => {

   const [isShowModal, setIsShowModal] = useState(false);

   console.log(address);
   console.log(process.env.REACT_APP_ADMIN)

   return (
      <div className='w-5/6 h-[80px] bg-white flex items-center justify-between px-5 rounded-lg'>
         {isShowModal && <AddProduct setIsShowModal={setIsShowModal} web3Provider={web3Provider} />}
         <Link to='/' className=' flex items-center'>
            <LiaGripfire size={38} className='text-green' />
            <span className='text-green text-xl font-bold'>AGRICHAIN</span>
         </Link>
         <ul className='flex gap-6'>
            <NavLink className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} to='/' key='/'>
               Trang chủ
            </NavLink>
            {address !== process.env.REACT_APP_ADMIN && <NavLink className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} to='/history' key='/history'>
               Lịch sử mua hàng
            </NavLink>}
            {address && address === process.env.REACT_APP_ADMIN &&
               <button onClick={() => setIsShowModal(true)} className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} >
                  Thêm sản phẩm
               </button>}
            {address === process.env.REACT_APP_ADMIN &&
               <NavLink className={({ isActive }) => isActive ? 'border-b-2 border-green-500' : ''} to='/order' key='/'>
                  Đơn hàng
               </NavLink>}
         </ul>
         <div className='border-1 border-gray-300 rounded-md p-2 hover:bg-bg-green text-666'>
            {address ? address : <button onClick={connectWallet} className="bg-grayBG p-3 rounded-md bg-green-500 text-white transition-all duration-200 delay-75">
               Connect Metamask
            </button>
            }
         </div>
      </div>
   )
}

export default Header