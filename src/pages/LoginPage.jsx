import { useLanguage } from "../context/languageStore";
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/auth.services"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

const LoginPage = () => {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();

  
  const [ email, setemail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const { verifyToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try{
      const response = await login({
        email,
        password
      });

      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken);
      } else {
        setErrorMessage("Login worked, but no auth token was returned.");
        return;
      }

      await verifyToken();
      navigate("/")
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to log in. Please check your email and password."
      );
    }
  };


  return (
  <div className="login-container">

    <div className="login-form">
      
      <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleLogin} className="login-form">

        <h2 className="login-title">{t("Login")}</h2>

        {errorMessage && <p className="auth-message-error">{tError(errorMessage)}</p>}

        <div className="form-group">
          <label>{t("Email")}</label>
          <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t("Password")}</label>
          <div className="password-input-wrapper">
            <input
            type={showPassword ? "text" : "password" }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? "😑" : "👀"}
            </button>
          </div>
        </div>

        <button type="submit" className="login-button"> {t("Login")} </button>

        <p className="auth-switch">
        <Link to="/forgot-password" className="auth-link"> {t("Forgot password?")} </Link>
      </p>

      </form>

      <p className="auth-switch"> {t("Don't have an account?")}{" "}
        <Link to="/signup" className="auth-link"> {t("Sign up")} </Link>
      </p>
    </div>

  </div>
  )
}

export default LoginPage
