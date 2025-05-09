import React from 'react';
import './assets/css/reset.css';
import './assets/css/global.css';
import './assets/css/responsive.css';
import './assets/css/header.css';
import './assets/css/home.css';
import './assets/css/cart.css';
import './assets/css/about.css';
import './assets/css/blog-details.css';
import './assets/css/product-details.css';
import './assets/css/footer.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home/Home';
import Header from './components/Layout/Header';
import Cart from './components/Cart/Cart';
import Footer from './components/Layout/Footer';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Product from './components/Product/Product';
import ProductPage from './components/Product/ProductPage';
import MainLayoutAccount from './components/Account/MainLayoutAccount';
import CoolPrintPage from './components/Coolxprint/CoolPrintPage';
import ConfirmEmail from './components/Account/ConfirmEmail';
import OrderHistory from './components/Product/OrderHistory';

function App() {
  return (
    <div id="app" style={{ overflowX: 'hidden' }}>
      <div id="site-wrapper">
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product-detail/:productId" element={<Product />} />
            <Route path="/collection-product/:categoryIdParam" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account/*" element={<MainLayoutAccount />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/coolxprint" element={<CoolPrintPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
