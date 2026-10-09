import { createContext, useState, useEffect } from "react";
import { verify } from "../services/auth.services"

export const AuthContext = createContext({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    verifyToken: async () => {},
    logout: () => {}
}); 

export const AuthProvider = ( {children} ) => {

    const [ user, setUser] = useState(null);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);

    const verifyToken = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
    
            if(!token) {
                setUser(null);
                setIsLoggedIn(false);
                return;
            }
            
            const response = await verify();


            setUser(response.data);
            setIsLoggedIn(true);
            return true;
        } catch (error) {
            localStorage.removeItem("authToken");
            setUser(null);
            setIsLoggedIn(false);
            return false;
        } finally {
            setIsLoading(false);
        }
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
            setUser,
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
