import { useLanguage } from "../context/languageStore";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/auth.services";
import { AuthContext } from "../context/AuthContext";


function SignupPage ()  {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();


  const { verifyToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false)
  const [ accountCreated, setAccountCreated ] = useState(false);

  const passwordRules = [
    {
      label: t("At least 6 characters"),
      passed: password.length >= 6,
    },
    {
      label: t("At least one number"),
      passed: /[0-9]/.test(password),
    },
    {
      label: t("At least one special character"),
      passed: /[\p{P}\p{S}]/u.test(password),
    },
  ];


  const handleSignup = async (event) => {
    event.preventDefault();
    
    if (submitting || accountCreated) return;

    setErrorMessage("");

    if(!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if(!passwordRules.every((rule) => rule.passed)) {
      setErrorMessage("Please complete all password requirements.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setErrorMessage("Your password is too long. Please use a shorter password.");
      return;
    }

    setSubmitting(true);
    let created = false;
      
    try {
      const response = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      created = true;

      setAccountCreated(true);

      const token = response.data.authToken;

      if(!token) {
        setErrorMessage(
          "Your account was created, but automatic login failed. Please log in below."
        );
        return;
      }

      localStorage.setItem("authToken", token);

      const authenticated =  await verifyToken();

      if(!authenticated) {
        setErrorMessage("Your account was created, but automatic login failed. Please log in below.");
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        created ? "Your account was created, but automatic login failed. Please log in below." : error.response?.data?.message || "Signup failed. Please try again late."
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="login-container">
      <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={ handleSignup } className="login-form">
        <h2 className="login-title">{t("Sign Up")}</h2>

        {errorMessage && (
          <p className="auth-message-error">{tError(errorMessage)}</p>
        )}
        
        {successMessage && (
          <p className="auth-message-success">{t(successMessage)}</p>
        )}

        <div className="form-group">
          <label>{t("Name")}</label>
          <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t("Email")}</label>
          <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">{t("Password")}</label>

  <div className="password-input-wrapper">
    <input
      id="signup-password"
      value={password}
      type={showPassword ? "text" : "password"}
      onChange={(e) => setPassword(e.target.value)}
      minLength={6}
      required
      autoComplete="new-password"
      aria-describedby="signup-password-rules"
    />

    <button
      type="button"
      className="signup-password-toggle"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? "😑" : "👀"}
    >
      {showPassword ? t("Hide") : t("Show")}
    </button>
  </div>

  <ul id="signup-password-rules" className="signup-password-rules">
    {[
      {
        label: t("At least 6 characters"),
        passed: password.length >= 6,
      },
      {
        label: t("At least one number"),
        passed: /[0-9]/.test(password),
      },
      {
        label: t("At least one special character"),
        passed: /[\p{P}\p{S}]/u.test(password),
      },
    ].map((rule) => (
      <li key={rule.label} className={rule.passed ? "is-met" : ""}>
        <span aria-hidden="true">{rule.passed ? "✓" : "•"}</span>
        <span>
          {rule.label}
          <span className="visually-hidden">
            {rule.passed ? t(" — met") : t(" — not met")}
          </span>
        </span>
      </li>
    ))}
  </ul>
        </div>

        <button type="submit" className="login-button"> {t("Create Account")} </button>
      </form>

      <p className="auth-switch"> {t("Already have an account?")}{" "}
        <Link to="/login" className="auth-link"> {t("Log in")} </Link>
      </p>

    </div>
  );
}
export default SignupPage;