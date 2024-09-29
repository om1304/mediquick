import React, { useState, useContext } from 'react';
import './home.css'; 
import Dolo650 from '../assets/Dolo-650.jpg';
import Ibuprofen600mg from '../assets/Ibuprofen-600mg.jpg';
import VitaminC from '../assets/vitamin-c-500-mg.jpg';
import Chatbot from '../Chatbot/Chatbot';
import { CartContext } from '../Cart/CartContext';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [alertMessage, setAlertMessage] = useState('');

  const Alert = ({ message, onClose }) => {
    return (
      <div className="alert">
        <span>{message}</span>
        <button onClick={onClose} className="close-alert">×</button>
      </div>
    );
  };

  const products = [
    { source: Dolo650, name: 'Dolo 650', price: '₹30', description: 'Pain reliever and fever reducer' },
    { source: Ibuprofen600mg, name: 'Ibuprofen 600mg', price: '₹8', description: 'Anti-inflammatory painkiller' },
    { source: VitaminC, name: 'Vitamin C 500mg', price: '₹12', description: 'Chewable tablets' },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setAlertMessage(`${product.name} has been added to your cart!`); 
    setTimeout(() => setAlertMessage(''), 3000); 
  };

  return (
    <div className='main'>
      <main>
        <section className="hero">
          <h1>Welcome to Online Medicine Delivery</h1>
          <p>Your one-stop solution for all medical needs</p>
        </section>

        <section className="products">
          <h2>Popular Products</h2>
          <div className="product-list">
            {products.map(product => (
              <div className="product-item" key={product.name}>
                <a href="#">
                  <img src={product.source} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>{product.price}</strong></p>
                </a>
                <button onClick={() => handleAddToCart(product)}>
                  <i className="bi bi-cart-check"></i>Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
        <Chatbot />
      </main>

      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage('')} />}

      <footer>
        <p>&copy; 2024 Online Medicine Delivery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
