import { BiArrowBack } from "react-icons/bi"
import { Link } from "react-router-dom";
import { useState } from "react";
import "../Css/LoginScreen.css";
import { firebase, auth,db } from '../Config/Config';
import { Redirect } from "react-router-dom";

const PhoneLoginScreen=()=>{

    const [editorText, setText] = useState("");
    const [show, setshow] = useState(false);
    const [otp, setotp] = useState('');
    const [final, setfinal] = useState('');
    const [redirectSelector, setRedirectSelector]= useState("")

    const signin = () => {
  
        if (editorText === "" || editorText.length < 10) return;
  
        let verify = new firebase.auth.RecaptchaVerifier('recaptchaContainer');
        auth.signInWithPhoneNumber(`+91${editorText}`, verify).then((result) => {
            setfinal(result);
            alert("code sent")
            setshow(true);
        })
            .catch((err) => {
                alert(err);
                window.location.reload()
            });
    }

    const ValidateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            console.log(result.user.phoneNumber);
            if(result){
                
                db.collection('UserData').where('phone', '==',result.user.phoneNumber).get()
                .then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        setRedirectSelector("/messages")
                        // console.log("User exists")
                    }
                    else {
                        // console.log("User doesnt exists")
                        db.collection("UserData").add({
                            phone:result.user.phoneNumber,
                            profileImg:"",
                            about:"",
                            name:""
                          })
                        .then(
                          setRedirectSelector("/loginform")
                        )
                    }
                })
            }
        }).catch((err) => {
            alert("Wrong code");
        })
    }
  
    

return(
    <>
     <div className="phoneheader">
         {redirectSelector? <Redirect to={`${redirectSelector}`}/>:null}
    <Link to="/"><BiArrowBack color="white" size="1.6rem"/></Link>
    <p>Verify your phone number </p>
   </div>
    <div className="inputPhone">
        <p>VartalApp will send an SMS message(carrier charges may apply) to verify your phone number. Enter your phone number:</p>
        <div className="IndiaCont"><p>India</p></div>
        <div className="phonenumberInput">
            <div className="phone1"><p>+&nbsp;&nbsp;91</p></div>
            <div className="phone2"><input type="number" name="phonenum" id="a1" maxLength="5" size="10" placeholder="00000-00000" onChange={(e) => setText(e.target.value)}  /></div>   
        </div>
        <div id="recaptchaContainer"></div>
        <button className="verifybutton" onClick={signin}>Next</button>   
        <div className="OTPContainer" style={{ display: show ? "block" : "none" }}>
            <p>Verify {editorText}</p>
            <p style={{color:"white", fontSize:"1.1rem", padding:"0 1rem 0 1rem" }}>Enter 6 digit OTP sent to your mobile number through SMS.</p>
                    <input type="number" placeholder="- - -  - - -"
                        onChange={(e) => { setotp(e.target.value) }}></input>
                    <br /><br />
                    <button onClick={ValidateOtp}>Confirm</button>
        </div>
    </div>
    <p className="ageRestrict">You must be at least <Link to="/phonemail" style={{color:"lightgreen"}}>16 years old</Link> to register. <Link to="/phonemail" style={{color:"lightgreen", textDecorationLine: 'underline'}}>Learn how</Link> VartalApp works with other companies.</p>
   
    </>
)
}
export default PhoneLoginScreen