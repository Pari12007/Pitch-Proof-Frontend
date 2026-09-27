import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { verify } from "../services/auth.services";

const PaymentSuccessPage = () => {
  const { setUser } = useContext(AuthContext);
  const [status, setStatus] = useState("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let timer;
    let checks = 0;

    const checkUpgrade = async () => {
      try {
        const { data: account } = await verify();
        if (!active) return;
        if (!account) throw new Error("Account unavailable");
        setUser(account);
        if (account.isPro) {
          setStatus("confirmed");
          return;
        }
        checks += 1;
        if (checks >= 10) {
          setStatus("pending");
          return;
        }
        timer = setTimeout(checkUpgrade, 2000);
      } catch {
        if (active) setStatus("error");
      }
    };

    checkUpgrade();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [attempt, setUser]);

  const retry = () => {
    setStatus("checking");
    setAttempt((value) => value + 1);
  };

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-icon" aria-hidden="true">{status === "confirmed" ? "✓" : "…"}</div>
        <span className="payment-success-eyebrow">PitchProof Pro</span>
        <h1>{status === "confirmed" ? "Your Pro access is active" : "Checking your upgrade"}</h1>
        <p role="status">
          {status === "checking" && "Waiting for your account upgrade to be confirmed…"}
          {status === "confirmed" && "Your account is now on Pro. You can continue using your business mentor."}
          {status === "pending" && "Your account has not been upgraded yet. If payment succeeded, do not pay again. Try checking again shortly; if it stays pending, contact support."}
          {status === "error" && "We couldn’t check your account. Check your connection and sign-in, then retry. You do not need to pay again."}
        </p>
        {(status === "pending" || status === "error") && (
          <button type="button" className="nav-button" onClick={retry}>Check again</button>
        )}
        <div className="payment-success-actions">
          <Link to="/profile" className="nav-button">Go to profile</Link>
          {status === "confirmed" && (
            <Link to="/workspaces" className="payment-success-link">Open my businesses</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
