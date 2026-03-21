import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/auth.services";

function SignupPage ()  {

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    
    setErrorMessage("");
    setSuccessMessage("");


    try{
      await signup({
        name,
        email,
        password,
      });

      setSuccessMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log("Signup failed", err);

      setErrorMessage(
        err.response?.data?.message || "Signup failed. Please try again later."
      )
    }
  }
  
  return (
    <div className="login-container">
      <form onSubmit={ handleSignup } className="login-form">
        <h2 className="login-title">Sign Up</h2>

        {errorMessage && (
          <p className="auth-message-error">{errorMessage}</p>
        )}
        
        {successMessage && (
          <p className="auth-message-success">{successMessage}</p>
        )}

        <div className="form-group">
          <label>Name</label>
          <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              value={password}
              type={ showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? "😑" : "👀"}
            </span>
          </div>
        </div>

        <button type="submit" className="login-button">
          Create Account
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
        Log in
        </Link>
      </p>

    </div>
  );
}
export default SignupPage;