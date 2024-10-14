// App.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './App.css'; // Asegúrate de importar los estilos

const stripePromise = loadStripe('pk_test_51Q9ZhsRqwuaDZ9m7VEq5s6CE6cZ4uFNTf2nGzHnFJFBP7aS9eovjb961hoSTtScnTpy8G9GgVYgV8QatPQUcd9ij00bgAbfu5L');

const App = () => {
  return (
    <div className="App">
      <div className="payment-container">
        <h2 className="payment-header">Realiza tu pago</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default App;
