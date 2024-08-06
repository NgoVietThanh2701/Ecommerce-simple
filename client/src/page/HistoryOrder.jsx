import React, { useState, useEffect } from 'react';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import ProductContract from '../contract/Product.contract.ts';
import DataTable from '../components/DataTable.jsx';
import { useOutletContext } from 'react-router-dom';
import { getAbiProduct, PRODUCT_ADDRESS } from '../contract/config.ts';
import { ethers } from 'ethers';
import Loading from '../components/Loading.jsx';

const nodata_img = require('../utils/images/no-data.jpg');

const HistoryOrder = () => {

   const [activeTab, setActiveTab] = useState("order");

   const [orders, setOrders] = useState([]);

   const getProductsOrder = async () => {
      try {
         const productContract = new ProductContract();
         const response = await productContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data) => data.productState === 1);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setOrders(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      getProductsOrder();
   }, []);

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

   const data = [
      {
         label: `Đã mua (${orders.length})`,
         value: "order",
         desc: orders.length > 0 ?
            <DataTable columns={columns} rows={orders} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      }
   ]

   return (
      <div className='w-5/6 my-10'>
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

export default HistoryOrder;

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
      field: 'price',
      headerName: 'Giá',
      width: 70,
      renderCell: (params) => (
         <span>{params.row.productDetails.price}</span>
      )
   },
   {
      field: 'sell',
      headerName: 'Người bán',
      width: 400,
      renderCell: (params) => (
         <span>{process.env.REACT_APP_ADMIN}</span>
      )
   },
]