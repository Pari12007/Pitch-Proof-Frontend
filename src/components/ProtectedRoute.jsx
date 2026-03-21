import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute ({children}) {
    const { isLoggedIn, isLoading } = useContext(AuthContext)

    if(isLoading) {
        return <p className="loading-text">Checking access...</p>;
    }

    if(!isLoggedIn) {
        return <Navigate to="/signup"/>
    }
    return children;
}

export default ProtectedRoute;