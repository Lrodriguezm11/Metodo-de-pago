// CheckoutForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }
  
    const amountInCents = Math.round(Number(amount) * 100);

    const response = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountInCents }),
    });
  
    const { clientSecret } = await response.json();
  
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Pago exitoso');
    }
  };

  // Estilos personalizados para los elementos de la tarjeta
  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff', // Texto blanco
        fontSize: '16px',
        '::placeholder': {
          color: '#888888', // Placeholder gris claro
        },
      },
      invalid: {
        color: '#ff6868', // Texto rojo para errores
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div>
        <label>
          Monto a pagar:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingresa el monto"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#282c34',
              color: '#ffffff',
            }}
          />
        </label>
      </div>
      <CardElement options={cardElementOptions} />
      <button type="submit" disabled={!stripe} style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        color: '#282c34',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
      }}
      >
        Pagar
      </button>
      {error && <div style={{ color: '#ff6868', marginTop: '15px' }}>{error}</div>}
      {success && <div style={{ color: '#28a745', marginTop: '15px' }}>{success}</div>}
    </form>
  );
};

export default CheckoutForm;
