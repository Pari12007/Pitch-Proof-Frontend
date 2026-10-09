import { useLanguage } from "../context/languageStore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { markDashboardVisited } from "../services/auth.services";

function DashboardGreeting({ user }) {
  const { t } = useLanguage();

    
    const { setUser } = useContext(AuthContext);

    //KEEP THE GREETING UNCHANGED THROUGHOUT THIS VISIT.
    const [isFirstVisit] = useState(() => !user.hasVisitedDashboard);

    useEffect(() => {
        let active = true;

        if(user.hasVisitedDashboard) return;

        const recoedVisit = async () => {
            try {
                await markDashboardVisited();

                if(active) {
                    setUser((previous) => {
                        if (previous?._id !== user._id) return previous;

                        return {
                            ...previous,
                            hasVisitedDashboard: true,
                        };
                    });
                }
            } catch (error) {
                console.error("Unable to record dashboard visit.");
            }
        };

        recoedVisit();

        return () => {
            active = false;
        };
    }, [user._id, user.hasVisitedDashboard, setUser]);


    return (
        <h1>
            {isFirstVisit ? t("Welcome") : t("Welcome back")}, {" "}
            {user.name || t("founder")}
        </h1>
    );
}

export default DashboardGreeting;