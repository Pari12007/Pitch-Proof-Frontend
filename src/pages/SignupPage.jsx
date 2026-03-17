import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth.services";

function SignupPage ()  {

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    try{
      await signup({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.log("Signup failed", err);
    }
  }
  
  return (
    <div className="login-container">
      <form onSubmit={ handleSignup } className="login-form">
        <h2 className="login-title">Sign Up</h2>

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
          <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-button">
          Create Account
        </button>
      </form>

    </div>
  );
}
export default SignupPage;