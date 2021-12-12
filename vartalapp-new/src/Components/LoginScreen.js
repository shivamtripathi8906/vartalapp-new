import React,{useEffect} from 'react'
import { BsFillTelephoneFill} from "react-icons/bs";
import H1 from "../Images/filename.jpg";
import { Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa";
import "../Css/LoginScreen.css"
import { GiHummingbird } from "react-icons/gi"
import { auth } from '../Config/Config';
import { useState } from 'react';

const LoginScreen=()=>{
  const [user, setUser]= useState(false)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
         console.log("16",user);
         setUser(true)
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
        {(user)? (<Link to="/phonelogin" className="loginCompo1"><div className=" phonebutton" >
        <BsFillTelephoneFill size="1.1rem" style={{background:"white"}}/>&nbsp; &nbsp; Sign in again
        </div></Link>)
        :
        <Link to="/phonelogin" className="loginCompo1"><div className=" phonebutton" >
        (<BsFillTelephoneFill size="1.1rem" style={{background:"white"}}/> &nbsp; &nbsp;Sign in with Phone
        </div></Link>
        }
        {(user)?(<Link to="/messages" className=" logincompo2"><div className=" phonebutton phonebutton2" >
        <GiHummingbird size="1.8rem" style={{background:"white"}}/> &nbsp; &nbsp;&nbsp;Take me to app 	&#8594;
        </div></Link>):null}
        
        <p className="from1">from </p><p className="byShiv">ShivamTripathi<FaCopyright size="0.8rem" color="white" style={{position:"absolute",top: "4px", right:"-1rem"}}/></p>
      </div>
    </div>
    )
}

export default LoginScreen;