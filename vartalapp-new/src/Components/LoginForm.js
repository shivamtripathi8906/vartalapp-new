import { useState, useEffect } from "react";
import I1 from "../Images/nouser.jpg";
import { Link } from "react-router-dom";
import { BsFillCameraFill} from "react-icons/bs";
import "../Css/LoginForm.css"
import { Redirect } from "react-router-dom";
import { auth,db, storage } from '../Config/Config';

const LoginForm=()=>{

    const [shareImage, setShareImage] = useState("");
    const [profilename, setProfieName]= useState("");
    const [confirmbuttstyle, setConfirmbutt]=useState("none");
    const [messageare, setMessagearea]= useState("block");
    const [profileabout, setProfileAbout]=useState("");
    const [user,setUser]= useState("");
    const [url,setUrl] = useState("")
  
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            console.log("20",user.phoneNumber);
            setUser(user.phoneNumber)
          }
        })
      },[])
    const setUserData=(event)=>{
      event.preventDefault();
      if (event.target !== event.currentTarget) {
        return;}
      
        db.collection('UserData').where('phone', '==',user).get()
        .then((querySnapshot) => {
          if (shareImage) {
            const upload = storage
              .ref(`profilePicture/${shareImage.name}`)
              .put(shareImage);
              upload.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (snapshot.state === "RUNNING") {
                  console.log(`progress=${progress}`);
                }
              },
              (error) => console.log(error.code),
              async () => {
                const downloadURL = await upload.snapshot.ref.getDownloadURL();
                db.collection("UserData").doc(querySnapshot.docs[0].id).update({
                    about:profileabout,
                    name:profilename,
                    profileImg:downloadURL,   
                });
              }
            );
          } else {
                db.collection("UserData").doc(querySnapshot.docs[0].id).update({
                    about:profileabout,
                    name:profilename,
                    profileImg:"", 
                });
            setUrl("true")
          }
        });
      }
    
     

      useEffect(() => {
        if(profilename!==""){
        setConfirmbutt("block")
        setMessagearea("none")}
        else 
        {setConfirmbutt("none")
        setMessagearea("block")}
      }, [profilename]);

    const handlePhotoChange = (e) => {
        const image = e.target.files[0];
        if (image === "" || image===undefined) {
          console.log(e.error.message);
          return;
        }
        setShareImage(image);
      };

return(
    
    <div className="fillformMainCont">
        {url? <Redirect to="/messages"/>:null}
        <div className="fillform_Photo">
              <div className="userProfilePhoto">
                 {shareImage? (<img src={URL.createObjectURL(shareImage)} alt="noim" />):(<img src={I1} alt="noImage" />)}
              </div>
              <input
                 type="file"
                 accept="image/gif, image/jpeg ,image/png"
                 name="image"
                 id="file"
                 multiple={false}
                 style={{ display: "none" }}
                 onChange={handlePhotoChange}
              />
              <div className="inputForProfile">
                  <label htmlFor="file" style={{ cursor: "pointer", background:"rgb(4, 145, 4)", borderRadius:"50%",height:"auto", paddingTop:"0.35rem", paddingLeft:"0.35rem", paddingRight:"0.3rem" }}>
                      <BsFillCameraFill color="white" size="1.5rem" style={{background:"rgb(4, 145, 4)" ,borderRadius:"50% 50% 0 0"}}/>
                  </label>
              </div>
              <p>Select an image</p>
        </div>
        <div className="userProfileDetails">
            <input type="textarea" name="text" id="profileName" placeholder="Enter your name" style={{width:"66%", marginBottom:"0.1rem"}}  onChange={(e) => setProfieName(e.target.value)}/>   
        </div>
        <div className="userProfileDetails">
            <input type="textarea" name="text" id="profileName" placeholder="Enter about" style={{width:"66%", marginBottom:"0.1rem"}}  onChange={(e) => setProfileAbout(e.target.value)}/>   
        </div>
        <div className="confirmbutt"  >
            <Link to="/app" style={{display:`${confirmbuttstyle}`}} onClick={(e)=>setUserData(e)}>Confirm</Link>
        </div>
        <p className="mandatoryMessage" style={{display:`${messageare}`}}>Name is mandatory to proceed.*</p>
    </div>
      
      )
}
        
       
export default LoginForm;