import { useContext, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/languageStore";
import { verifyEmail } from "../services/auth.services";

export default function VerifyEmailPage() {
    const { t, tError } = useLanguage();
    const { isLoggedIn, verifyToken } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") || "";
    const validToken = /^[a-f0-9]{64}$/.test(token);

    const [ saving, setSaving ] = useState(false);
    const [ verifiedToken, setVerifiedToken ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState("");
    const submitting = useRef(false);

    const verified = verifiedToken === token;

    const handleVerify = async () => {
        if (!validToken || submitting.current || verified) return;

        submitting.current = true;
        setSaving(true);
        setErrorMessage("");

        try {
            await verifyEmail(token);
            setVerifiedToken(token);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Unable to verify your email. Please try again."
            );
            return
        } finally {
            submitting.current = false;
            setSaving(false);
        }

        //REFRESH THE CURRENT ACCOUNT WITHOUT CHANGING VERFICATION SUCCESS.
        if (isLoggedIn) {
            try {
                await verifyToken();
            } catch {
                //THE EMAIL WAS VERIFIED EVEN IF REFRESHING THE SESSION FAILED. 
            }
        }
    };


    return (
        <main className="login-container">
            <div className="login-form">
                <h1 className="login-title">{t("Verify your email")}</h1>

                {verified ? (
                    <>
                        <p role="status">{t("Your email has been verified.")}</p>

                        <Link to={isLoggedIn ? "/dashboard" : "/login"} className="auth-link">
                        {t(isLoggedIn ? "Go to dashboard" : "Go to login")}
                        </Link>
                    </>
                ) : !validToken ? (
                    <p role="alert" className="auth-message-error">
                        {t("This verification link is invalid or has expired.")}
                    </p>
                ) : (
                    <>
                        <p>
                            {t("Click below to confirm your email address for PitchProof.")}
                        </p>

                        {errorMessage && (
                            <p role="alert" className="auth-message-error">
                                {tError(errorMessage)}
                            </p>
                        )}

                        <button
                            type="button"
                            className="login-button"
                            disabled={saving}
                            onClick={handleVerify}
                        >
                            {t(saving ? "Verifying..." : "Verify email")}
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}
