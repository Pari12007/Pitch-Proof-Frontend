import { useLanguage } from "../context/languageStore";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { verify } from "../services/auth.services";

const PaymentSuccessPage = () => {
  const { t } = useLanguage();

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
        if (!account) throw new Error(t("Account unavailable"));
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
        <span className="payment-success-eyebrow">{t("PitchProof Pro")}</span>
        <h1>{status === "confirmed" ? t("Your Pro access is active") : t("Checking your upgrade")}</h1>
        <p role="status">
          {status === "checking" && t("Waiting for your account upgrade to be confirmed…")}
          {status === "confirmed" && t("Your account is now on Pro. You can continue using your business mentor.")}
          {status === "pending" && t("Your account has not been upgraded yet. If payment succeeded, do not pay again. Try checking again shortly; if it stays pending, contact support.")}
          {status === "error" && t("We couldn’t check your account. Check your connection and sign-in, then retry. You do not need to pay again.")}
        </p>
        {(status === "pending" || status === "error") && (
          <button type="button" className="nav-button" onClick={retry}>{t("Check again")}</button>
        )}
        <div className="payment-success-actions">
          <Link to="/profile" className="nav-button">{t("Go to profile")}</Link>
          {status === "confirmed" && (
            <Link to="/workspaces" className="payment-success-link">{t("Open my businesses")}</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
