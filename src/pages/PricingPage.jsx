import { createCheckoutSssion } from "../services/billling.services";

const PricingPage = () => {
    const handleUpgrade = async () => {
        try {
            const response = await createCheckoutSssion();

            // Redirect to Stripe Checkout.
            window.location.href = response.data.url;
        } catch (error) {
            console.log("Checkout error:", error);
            console.log(error.response?.data);
        }
    };

    return (
        <div className="pricing-page">
            <section className="pricing-hero">
                <div className="pricing-hero-copy">
                    <span className="pricing-eyebrow">Simple pricing</span>
                    <h1>Choose the plan that matches how fast you want to build.</h1>
                    <p>
                        Start free, validate your ideas, and upgrade when you want
                        unlimited AI help and unrestricted posting.
                    </p>

                    <div className="pricing-highlights">
                        <div className="pricing-highlight-pill">No monthly lock-in</div>
                        <div className="pricing-highlight-pill">One-time Pro payment</div>
                        <div className="pricing-highlight-pill">Upgrade in seconds</div>
                    </div>
                </div>

                <div className="pricing-hero-panel">
                    <span className="pricing-panel-label">Best for active founders</span>
                    <h2>Pro unlocks the full Pitch Proof workflow.</h2>
                    <p>
                        Generate faster, test more ideas, and keep momentum without
                        running into feature limits.
                    </p>
                    <div className="pricing-panel-stats">
                        <div>
                            <strong>Unlimited</strong>
                            <span>AI guidance</span>
                        </div>
                        <div>
                            <strong>Unlimited</strong>
                            <span>Idea submissions</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pricing-grid">
                <div className="pricing-card">
                    <div className="pricing-card-top">
                        <span className="pricing-tier-tag">For getting started</span>
                        <h2>Free</h2>
                        <p>Explore the platform and test your first ideas.</p>
                    </div>

                    <div className="pricing-price-row">
                        <h3>EUR 0</h3>
                        <span>Forever free</span>
                    </div>

                    <ul className="pricing-feature-list">
                        <li>Limited AI assistance</li>
                        <li>Limited idea posting</li>
                        <li>Perfect for trying the platform</li>
                    </ul>

                    <div className="pricing-card-footer">
                        <span>Great if you want to look around first.</span>
                    </div>
                </div>

                <div className="pricing-card pro-card">
                    <div className="pricing-card-badge">Most popular</div>
                    <div className="pricing-card-top">
                        <span className="pricing-tier-tag">For serious building</span>
                        <h2>Pro</h2>
                        <p>Remove the limits and keep your idea pipeline moving.</p>
                    </div>

                    <div className="pricing-price-row">
                        <h3>EUR 9.99</h3>
                        <span>One-time payment</span>
                    </div>

                    <ul className="pricing-feature-list">
                        <li>Unlimited AI</li>
                        <li>Unlimited ideas</li>
                        <li>Best value for active founders</li>
                    </ul>

                    <button className="pricing-cta-button" onClick={handleUpgrade}>
                        Upgrade to pro
                    </button>

                    <div className="pricing-card-footer">
                        <span>Secure checkout with Stripe.</span>
                    </div>
                </div>
            </div>

            <section className="pricing-bottom-note">
                <p>
                    Every plan gives you access to the core Pitch Proof experience.
                    Pro is there when you are ready to go all in.
                </p>
            </section>
        </div>
    );
};

export default PricingPage;
