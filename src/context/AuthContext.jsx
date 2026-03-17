import { createContext, useState, useEffect } from "react";
import { verify } from "../services/auth.services"

export const AuthContext = createContext(); 

export const AuthProvider = ( {children} ) => {

    const [ user, setUser] = useState(null);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    const verifyToken = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");

        if(!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try{
            const response = await verify();
            setUser(response.data);
            setIsLoggedIn(true);
        } catch (err) {
            localStorage.removeItem("authToken");
            setUser(null);
            setIsLoggedIn(false);
        }

        setIsLoading(false);
    }; 

    const logout = () => {
        localStorage.removeItem("authToken")
        setUser(null);
        setIsLoggedIn(false);
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider
        value={{
            user,
            isLoggedIn,
            isLoading,
            verifyToken,
            logout
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}