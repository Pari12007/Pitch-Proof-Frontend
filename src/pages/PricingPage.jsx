import { useLanguage } from "../context/languageStore";
import { createCheckoutSssion } from "../services/billling.services";
import { useRef, useState } from "react";

const PricingPage = () => {
  const { t , tError } = useLanguage();


    const [ checkingOut, setCheckingOut ] = useState(false);
    const [ checkoutError, setCheckoutError ] = useState("")
    const checkoutPending = useRef(false);

    const handleUpgrade = async () => {

        if (checkoutPending.current) return;

        checkoutPending.current = true;
        setCheckingOut(true);
        setCheckoutError("");

        
        try {
            const response = await createCheckoutSssion();

            if (!response.data?.url) {
                throw new Error(t("Missing checkout URL."));
            }

            // Redirect to Stripe Checkout.
            window.location.assign(response.data.url);
        } catch (error) {
            setCheckoutError(
                error.response?.data?.message || "Unable to open checkout. Please try again."
            );
            checkoutPending.current = false;
            setCheckingOut(false);
    };}

    return (
        <div className="pricing-page">
            <section className="pricing-hero">
                <div className="pricing-hero-copy">
                    <span className="pricing-eyebrow">{t("Simple pricing")}</span>
                    <h1>{t("Choose the plan that matches how fast you want to build.")}</h1>
                    <p> {t("Start free, validate your ideas, and upgrade when you want unlimited AI help and unrestricted posting.")} </p>

                    <div className="pricing-highlights">
                        <div className="pricing-highlight-pill">{t("No monthly lock-in")}</div>
                        <div className="pricing-highlight-pill">{t("One-time Pro payment")}</div>
                        <div className="pricing-highlight-pill">{t("Upgrade in seconds")}</div>
                    </div>
                </div>

                <div className="pricing-hero-panel">
                    <span className="pricing-panel-label">{t("Best for active founders")}</span>
                    <h2>{t("Pro unlocks the full Pitch Proof workflow.")}</h2>
                    <p> {t("Generate faster, test more ideas, and keep momentum without running into feature limits.")} </p>
                    <div className="pricing-panel-stats">
                        <div>
                            <strong>{t("Unlimited")}</strong>
                            <span>{t("AI guidance")}</span>
                        </div>
                        <div>
                            <strong>{t("Unlimited")}</strong>
                            <span>{t("Idea submissions")}</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pricing-grid">
                <div className="pricing-card">
                    <div className="pricing-card-top">
                        <span className="pricing-tier-tag">{t("For getting started")}</span>
                        <h2>{t("Free")}</h2>
                        <p>{t("Explore the platform and test your first ideas.")}</p>
                    </div>

                    <div className="pricing-price-row">
                        <h3>{t("EUR 0")}</h3>
                        <span>{t("Forever free")}</span>
                    </div>

                    <ul className="pricing-feature-list">
                        <li>{t("Limited AI assistance")}</li>
                        <li>{t("Limited idea posting")}</li>
                        <li>{t("Perfect for trying the platform")}</li>
                    </ul>

                    <div className="pricing-card-footer">
                        <span>{t("Great if you want to look around first.")}</span>
                    </div>
                </div>

                <div className="pricing-card pro-card">
                    <div className="pricing-card-badge">{t("Most popular")}</div>
                    <div className="pricing-card-top">
                        <span className="pricing-tier-tag">{t("For serious building")}</span>
                        <h2>{t("Pro")}</h2>
                        <p>{t("Remove the limits and keep your idea pipeline moving.")}</p>
                    </div>

                    <div className="pricing-price-row">
                        <h3>{t("EUR 9.99")}</h3>
                        <span>{t("One-time payment")}</span>
                    </div>

                    <ul className="pricing-feature-list">
                        <li>{t("Unlimited AI")}</li>
                        <li>{t("Unlimited ideas")}</li>
                        <li>{t("Best value for active founders")}</li>
                    </ul>

                    {checkoutError && (
                        <p role="alert" className="create-form-error">
                            {tError(checkoutError)}
                        </p>
                    )}

                    <button 
                    type="button"
                    className="pricing-cta-button"
                    onClick={handleUpgrade}
                    disabled={checkingOut}
                    >
                        {checkingOut ? t("Opening checkout...") : t("Upgrade to Pro")}
                    </button>

                    <div className="pricing-card-footer">
                        <span>{t("Secure checkout with Stripe.")}</span>
                    </div>
                </div>
            </div>

            <section className="pricing-bottom-note">
                <p> {t("Every plan gives you access to the core Pitch Proof experience. Pro is there when you are ready to go all in.")} </p>
            </section>
        </div>
    );
};

export default PricingPage;
