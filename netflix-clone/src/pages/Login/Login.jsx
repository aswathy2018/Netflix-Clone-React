import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import { login, signup } from '../../firebase'
import netflix_spinner from '../../assets/netflix_spinner.gif'

const Login = () => {

  const [signState, seSignState] = useState("Sign In")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateName = (value) => {
    if (!value.trim()) {
      return "Name is required";
    }
    if (/\s{2,}/.test(value)) {
      return "Continuous spaces are not allowed";
    }
    if (value.startsWith(' ') || value.endsWith(' ')) {
      return "Spaces at the beginning or end are not allowed";
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return "Only letters and single spaces are allowed";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    
    if (/^[A-Z]/.test(value)) {
      return "Email should not start with capital letters";
    }
    
    if (/[A-Z]/.test(value)) {
      return "Capital letters are not allowed in email";
    }
    
    const emailPattern = /^[a-z]+[a-z0-9]*@[a-z]+\.[a-z]{2,}$/;
    
    if (!emailPattern.test(value)) {
      return "Invalid email format (e.g., user@gmail.com)";
    }
    
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.startsWith(' ') || value.endsWith(' ')) {
      return "Spaces at the beginning or end are not allowed";
    }
    if (/\s{2,}/.test(value)) {
      return "Continuous spaces are not allowed";
    }
    if (value.length < 4) {
      return "Password must be at least 4 characters";
    }
    if (value.length > 10) {
      return "Password must not exceed 10 characters";
    }
    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const user_auth = async(event) => {
    event.preventDefault();
    
    let hasError = false;
    
    if (signState === "Sign Up") {
      const nameErr = validateName(name);
      setNameError(nameErr);
      if (nameErr) hasError = true;
    }
    
    const emailErr = validateEmail(email);
    setEmailError(emailErr);
    if (emailErr) hasError = true;
    
    const passwordErr = validatePassword(password);
    setPasswordError(passwordErr);
    if (passwordErr) hasError = true;
    
    if (hasError) {
      return;
    }
    
    setLoading(true)
    if(signState==="Sign In"){
      await login(email, password);
    }else{
      await signup(name, email, password);
    }
    setLoading(false)
  }

  return (
    loading?<div className="login-spinner">
      <img src={netflix_spinner} alt="" />
    </div>:
    <div className='login'>
      <img src={logo} className='login-logo' alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form action="">
          {signState==="Sign Up"?
            <>
              {nameError && <p style={{color: 'red', fontSize: '14px', margin: '0 0 5px 0'}}>{nameError}</p>}
              <input value={name} onChange={handleNameChange} type="text" placeholder='Your name'/>
            </>
          :<></>}
          
          {emailError && <p style={{color: 'red', fontSize: '14px', margin: '0 0 5px 0'}}>{emailError}</p>}
          <input value={email} onChange={handleEmailChange} type="email" placeholder='Email'/>
          
          {passwordError && <p style={{color: 'red', fontSize: '14px', margin: '0 0 5px 0'}}>{passwordError}</p>}
          <input value={password} onChange={handlePasswordChange} type="password" placeholder='Password'/>
          
          <button onClick={user_auth} type='submit'>{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help</p>
          </div>
        </form>
        <div className="form-switch">
          {signState==="Sign In"?<p>New to Netflix? <span onClick={()=>{seSignState("Sign Up")}}>Sign Up Now</span></p>:<p>Already have account? <span onClick={()=>{seSignState("Sign In")}}>Sign In Now</span></p>}
        </div>
      </div>
    </div>
  )
}

export default Login