// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Products from "./pages/Products";
// import Invoices from "./pages/Invoices";
// import InvoiceForm from "./components/InvoiceForm";
// import InvoiceList from "./components/InvoiceList";
// import SalesReport from "./components/SalesReport";
// import ProductForm from "./components/ProductForm";
// import ProfitLoss from "./Stats/ProfitLoss";

// function App() {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/productForm" element={<ProductForm/>}/>
//           <Route path="/products" element={<Products />} />
//           <Route path="/invoices" element={<Invoices />} />
//           <Route path="/invoices/create" element={<InvoiceForm />} />
//           <Route path="/invoices/list" element={<InvoiceList />} />
//           <Route path="/sales-report" element={<SalesReport />} />
//           <Route path="/profit-loss" element={<ProfitLoss />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProductsPage from "./pages/ProductsPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import SalesReport from "./components/SalesReport";
import ProductForm from "./components/ProductForm";
import ProfitLoss from "./Stats/ProfitLoss";
import PrivateRoute from "./components/PrivateRoute"; // Import Private Route

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/productForm" element={<PrivateRoute element={<ProductForm />} />} />
        <Route path="/products" element={<PrivateRoute element={<ProductsPage />} />} />
        <Route path="/invoices" element={<PrivateRoute element={<InvoicesPage />} />} />
        <Route path="/invoices/create" element={<PrivateRoute element={<InvoiceForm />} />} />
        <Route path="/invoices/list" element={<PrivateRoute element={<InvoiceList />} />} />
        <Route path="/sales-report" element={<PrivateRoute element={<SalesReport />} />} />
        <Route path="/profit-loss" element={<PrivateRoute element={<ProfitLoss />} />} />
      </Routes>
    </Router>
  );
}

export default App;
