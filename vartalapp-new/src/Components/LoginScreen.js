import React,{useEffect} from 'react'
import { BsFillTelephoneFill} from "react-icons/bs";
import H1 from "../Images/filename.jpg";
import { Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa";
import "../Css/LoginScreen.css"

import { auth } from '../Config/Config';

const LoginScreen=()=>{

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("16",user);
      }
    })
  },[])
    return(
        <div className="mainContainer">
        
      <div className="heading">
        <p>Welcome to VartalApp</p>
        <img src={H1} alt="hero1" />
      </div>
      <div className="loginCompo">
        <Link to="/phonelogin" className="loginCompo1"><div className=" phonebutton" >
        <BsFillTelephoneFill size="1.1rem" style={{background:"white"}}/> &nbsp; &nbsp;Sign in with Phone
        </div></Link>
        
        <p className="from1">from </p><p className="byShiv">ShivamTripathi<FaCopyright size="0.8rem" color="white" style={{position:"absolute",top: "4px", right:"-1rem"}}/></p>
      </div>
    </div>
    )
}

export default LoginScreen;