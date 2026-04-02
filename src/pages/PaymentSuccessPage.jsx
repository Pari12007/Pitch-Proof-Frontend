import { Link } from "react-router-dom";

const PaymentSuccessPage = () => {
  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-icon">✓</div>
        <span className="payment-success-eyebrow">Upgrade confirmed</span>
        <h1>Payment successful</h1>
        <p>
          Your Pro upgrade is being processed and your account should update
          shortly. You can head to your profile to check your plan status.
        </p>

        <div className="payment-success-highlights">
          <div className="payment-success-pill">Secure payment completed</div>
          <div className="payment-success-pill">Pro access on the way</div>
        </div>

        <div className="payment-success-actions">
          <Link to="/profile" className="nav-button">
            Go to profile
          </Link>
          <Link to="/ai" className="payment-success-link">
            Start using PitchProof AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
