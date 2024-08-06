import React, { useState, useEffect } from 'react';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import ProductContract from '../contract/Product.contract.ts';
import DataTable from '../components/DataTable.jsx';
import { useOutletContext } from 'react-router-dom';
import { getAbiProduct, PRODUCT_ADDRESS } from '../contract/config.ts';
import { ethers } from 'ethers';
import Loading from '../components/Loading.jsx';

const nodata_img = require('../utils/images/no-data.jpg');

const Order = () => {

   const { web3Provider } = useOutletContext();

   const [activeTab, setActiveTab] = useState("order");

   const [orders, setOrders] = useState([]);
   const [selled, setSelled] = useState([]);

   const getProductsOrder = async () => {
      try {
         const productContract = new ProductContract();
         const response = await productContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data) => data.productState === 2);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setOrders(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsSelled = async () => {
      try {
         const productContract = new ProductContract();
         const response = await productContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data) => data.productState === 2);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setSelled(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      getProductsOrder();
   }, [])

   const convertObjectProduct = (data) => {
      return {
         uid: data.uid.toNumber(),
         consumer: data.consumer,
         productState: data.productState,
         productDetails: {
            name: data.productDetails.name,
            price: data.productDetails.price.toNumber(),
            image: data.productDetails.image,
            description: data.productDetails.description,
         }
      }
   }

   const handleConfirm = async (uid) => {
      if (web3Provider) {
         try {
            setIsLoading(true);
            const productContract = new ProductContract(web3Provider);
            await productContract.comfirm(uid);
            listenEvent();
         } catch (error) {
            setIsLoading(false);
            console.log(error);
         }
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(PRODUCT_ADDRESS, getAbiProduct(), web3Provider);
      contract.once("Confirm", (uid) => {
         setIsLoading(false);
         getProductsOrder();
         getProductsSelled();
      })
   }

   const action = {
      field: 'action',
      headerName: 'Thao tác',
      width: 110,
      renderCell: (params) => (
         <button onClick={() => handleConfirm(params.row.uid)} className='text-white bg-green-500 px-3 py-1.5 rounded-md'>Xác nhận</button>
      )
   }

   const data = [
      {
         label: `Đơn đặt hàng (${orders.length})`,
         value: "order",
         desc: orders.length > 0 ?
            <DataTable columns={columns.concat(action)} rows={orders} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Đã bán()`,
         value: "selled",
         desc: selled.length > 0 ?
            <DataTable columns={columns} rows={selled} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      }
   ]

   return (
      <div className='w-5/6 my-10'>
         {isLoading && <Loading />}
         <Tabs value={activeTab}>
            <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
               indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
               {data.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-[#EF4D2D] text-[15px] border-b-2 border-[#EF4D2D]" : "text-[15px]"}>
                     {label}
                  </Tab>
               ))}
            </TabsHeader>
            <TabsBody>
               {data.map(({ value, desc }) => (
                  <TabPanel key={value} value={value}>
                     {desc}
                  </TabPanel>
               ))}
            </TabsBody>
         </Tabs>
      </div>
   )
}

export default Order;

const columns = [
   {
      field: 'uid',
      headerName: 'ID',
      width: 50,
      renderCell: (params) => (
         <span>{params.row.uid}</span>
      )
   },
   {
      field: 'name',
      headerName: 'Tên san phẩm',
      width: 180,
      renderCell: (params) => (
         <span>{params.row.productDetails.name}</span>
      )
   },
   {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 200,
      renderCell: (params) => (
         <img className='rounded-full w-24 h-20 object-cover' src={params.row.productDetails.image} alt="" />
      )
   },
   {
      field: 'quantity',
      headerName: 'Mô tả',
      width: 170,
      renderCell: (params) => (
         <span>{params.row.productDetails.description}</span>
      )
   },
   {
      field: 'quantity',
      headerName: 'Mô tả',
      width: 70,
      renderCell: (params) => (
         <span>{params.row.productDetails.price}</span>
      )
   },
   {
      field: 'consumer',
      headerName: 'Người mua',
      width: 400,
      renderCell: (params) => (
         <span>{params.row.consumer}</span>
      )
   },
]