import React, { useContext} from 'react';
import { CartContext } from '../Cart/CartContext';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="main">

      <div className="breadcrumb">
        <a onClick={() => navigate('/')}>Home</a> &gt; <span>Cart</span>
      </div>

      <h2>{cartItems.length} Items in your Cart</h2>
      {cartItems.length === 0 ? (
        <div>Your cart is empty!</div>
      ) : (
        <div>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.source} alt={item.name} />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">{item.price}</div>
                </div>
                <button className="remove-button" onClick={() => removeFromCart(item.name)}>Remove</button>
              </li>
            ))}
          </ul>
          <button className="clear-cart-button" onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
