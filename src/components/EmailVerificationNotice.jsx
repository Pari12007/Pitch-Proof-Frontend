import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/languageStore";
import { resendVerificationEmail } from "../services/auth.services";

export default function EmailVerificationNotice() {

    const { user, isLoggedIn, isLoading, verifyToken } = useContext(AuthContext);
    const { t, tError } = useLanguage();
    

    const [ sending, setSending ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const submitting = useRef(false);

    const handleResend = async () => {
        if (submitting.current) return;

        submitting.current = true;
        setSending(true);
        setMessage("");
        setErrorMessage("");

        try {
            const { data } = await resendVerificationEmail();
            setMessage(data.message);

            if (data.message === "Your email is already verified.") {
                await verifyToken();
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Unable to send the verification email. Please try again.");
        } finally {
            submitting.current = false;
            setSending(false);
        }
    };

    if(isLoading || !isLoggedIn || !user || user.emailVerifiedAt) {
        return null;
    }

    return (
        <aside className="email-verification-notice" aria-label={t("Email verification")}>
            <p>
                <strong>{t("Verify your email")}</strong>
            </p>

            <p>
                {t("Check your inbox for a verification link from PitchProof.")}
            </p>

            <button type="button" disabled={sending} onClick={handleResend}>
                {t(sending ? "Sending..." : "Resend verification email")}
            </button>

            {message && <p role="status">{t(message)}</p>}

            {errorMessage && (
                <p role="alert" className="auth-message-error">
                    {tError(errorMessage)}
                </p>
            )}
        </aside>
    )
}
