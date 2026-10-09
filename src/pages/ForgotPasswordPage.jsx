import { useLanguage } from "../context/languageStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/auth.services";

function ForgotPasswordPage() {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();


    const [ email, setEmail ] = useState("")
    const [ sending, setSending ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ error, setError ] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(sending) return;

        setError("");
        setMessage("")
        setSending(true);

        try {
            const response = await forgotPassword(email.trim());
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to request a reset. Please try again.");
        } finally {
            setSending(false);
        }
    };
    
    
    return (
        <main className="login-container">
            <div className="login-form">
                <h1 className="login-title">{t("Forgot password?")}</h1>
                <p>{t("Enter your PitchProof account email to request a reset link.")}</p>

                {message && <p role="status">{t(message)}</p>}

                {error && (
                    <p className="auth-message-error" role="alert">{tError(error)}</p>
                )}

                <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reset-email">{t("Email")}</label>

                        <input
                        id="reset-email"
                        className="form-control"
                        type="email"
                        autoComplete="email"
                        placeholder={t("you@example.com")}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={254}
                        required
                        disabled={sending}
                        />
                    </div>

                    <button
                    type="submit"
                    className="login-button"
                    disabled={sending}
                    >
                        {sending ? t("Sending...") : t("Send reset link")}
                    </button>
                </form>

                <p className="auth-switch">
                    <Link to="/login" className="auth-link">{t("Back to login")}</Link>
                </p>
            </div>
        </main>
    )
}

export default ForgotPasswordPage