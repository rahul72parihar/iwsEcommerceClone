import '../styles/Cartpage.css'; // Reuse cart styling

export default function CheckoutPage() {
  return (
    <div className="cart-page">
      <h1>Checkout</h1>
      <p>Checkout functionality coming soon!</p>
      <div style={{marginTop: '2rem', fontSize: '1.2rem', color: '#666'}}>
        Your cart will be processed here. For now, return to <a href="/cartpage" style={{color: '#667eea'}}>Cart</a>.
      </div>
    </div>
  );
}

