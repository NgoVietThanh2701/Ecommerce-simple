import { Route, Routes } from "react-router-dom";
import Shop from "./page/Shop";
import AddProduct from "./page/AddProduct";
import Layout from "./page/Layout";
import Order from "./page/Order";
import HistoryOrder from "./page/HistoryOrder";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route path='/' element={<Shop />} />
            <Route path="/order" element={<Order />} />
            <Route path="/history" element={<HistoryOrder />} />
         </Route>
      </Routes>
   );
}

export default App;
