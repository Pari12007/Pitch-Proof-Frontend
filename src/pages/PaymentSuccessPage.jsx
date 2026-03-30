import { Link } from "react-router-dom" 

const PaymentSuccessPage = () => {
  return (
    <div className="page-shell">
      <h1>Payment Successful</h1>
      <p>Your Pro upgrade is being processed.</p>
      <Link to="/profile" className="nav-button">
      Go to profile</Link>
    </div>
  )
}

export default PaymentSuccessPage