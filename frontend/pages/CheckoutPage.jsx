import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/CheckoutPage.css';
      <h1>Checkout</h1>
      <p>Checkout functionality coming soon!</p>
      <div style={{marginTop: '2rem', fontSize: '1.2rem', color: '#666'}}>
        Your cart will be processed here. For now, return to <a href="/cartpage" style={{color: '#667eea'}}>Cart</a>.
      </div>
    </div>
  );
}

