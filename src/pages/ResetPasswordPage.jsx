import { useLanguage } from "../context/languageStore";
import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { resetPassword } from "../services/auth.services";


function ResetPasswordPage() {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();


    const [ searchParams, setSearchParams ] = useSearchParams();
    const token = searchParams.get("token") || "";
    
    const { logout } = useContext(AuthContext);

    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ saving, setSaving ] = useState(false);
    const [ error, setError ] = useState("");
    const [ complete, setComplete ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);

    const validTokenFormat = /^[a-f0-9]{64}$/.test(token);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (saving || complete || !validTokenFormat) return;

        setError("");

        if(password.length < 6 || 
            !/[0-9]/.test(password) ||
            !/[\p{P}\p{S}]/u.test(password)
        ) {
            setError("Use at least 6 characters, including one number and one special character.");
            return;
        }

        if (new TextEncoder().encode(password).length > 72) {
            setError("Your password is to long. Use no more then 72 UTF-8 bytes.");
            return;
        }

        if(password !== confirmPassword) {
            setError("Your password do not match.");
            return;
        }

        setSaving(true);

        try {
            await resetPassword(token, password);

            //CLEAR THE BROWSER'S PREVIOUS LOGIN SESSION AFTER A SUCCESSFUL RESET.
            logout();
            setPassword("");
            setConfirmPassword("");
            setComplete(true);

            //REMOVE THE CONSUMED TOKEN FROM THE ADDRESS BAR.
            setSearchParams({}, { replace: true })
        } catch (error) {
            setError(error.response?.data?.message || "Unable to reset your password. Please try again.");
        } finally {
            setSaving(false);
        }
    };


    return (
        <main className="login-container">
            <div className="login-form">
                <h1 className="login-title"> {t("Reset your password")} </h1>

                {complete ? (
                    <>
                        <p role="status">{t("Your password has been reset. Lod in with your new password.")}</p>

                        <Link to="/login" className="auth-link">{t("Go to login")}</Link>
                    </>
                ) : !validTokenFormat ? (
                    <>
                        <p role="alert">{t("This reset link is missing or invalid.")}</p>
                        <Link to="/forgot-password" className="auth-link">{t("Request a new reset link")}</Link>
                    </>
                ) : (
                    <>
                        <p>{t("Use at least 6 characters, including one number and one special character.")}</p>

                        {error && (
                            <p className="auth-message-error" role="alert">
                                {tError(error)}
                            </p>
                        )}

                        <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="new-password">{t("New password")}</label>

                                <div className="password-input-wrapper">
                                <input 
                                    id="new-password"
                                    className="form-control"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder={t("Enter your new password")}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    minLength={6}
                                    required
                                    disabled={saving}
                                />

                                <button
                                type="button"
                                className="togle-password"
                                onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? t("Hide new password") : t("Show new password")} aria-controls="new-password" disabled={saving}>
                                    {showPassword ? t("Hide") : t("Show")}
                                </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">{t("Confirm password")}</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="confirm-password"
                                        className="form-control"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder={t("Enter your new password agian")}
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        minLength={6}
                                        required
                                        disabled={saving}
                                    />

                                    <button
                                    type="button"
                                    className="togle-password"
                                    onClick={() => setShowConfirmPassword((previous) => !previous)}
                                    aria-label={showConfirmPassword ? "😑" : "👀"}
                                    aria-control="confirm-password"
                                    disabled={saving}
                                    >
                                        {showConfirmPassword ? "😑" : "👀"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={saving}
                            >
                                {saving ? t("Saving...") : t("Reset password")}
                            </button>
                        </form>

                        <p className="auth-switch">
                            <Link to="/forgot-password" className="auth-link">{t("Request a new reset link")}</Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    )
}

export default ResetPasswordPage