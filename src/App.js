import React from 'react';
import { CartProvider } from './Cart/CartContext';
import Home from './Home/home';
import Cart from './Cart/Cart';
import Navbar from './Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MedicineDetails from './MedicineDetails/MedicineDetails'; // Import your medicine details component
import TransactionSuccess from "./pages/TransactionSuccess";
import TransactionFailure from "./pages/TransactionFailure";
import ResetPasswordModal from "./pages/ResetPasswordModal";
import Profile from './profile/Profile';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/medicine/:medicineId" element={<MedicineDetails />} />
          <Route path="/payment-success" element={<TransactionSuccess />} />
          <Route path="/payment-failure" element={<TransactionFailure />} />
          <Route path="/reset-password" element={<ResetPasswordModal />} />
          <Route path="/profile" element={ <Profile /> } />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
