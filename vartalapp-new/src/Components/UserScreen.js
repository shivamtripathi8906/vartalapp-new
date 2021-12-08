import NavigationBar from "./NavigationBar";
import U1 from "../Images/nouser.jpg";
import { HiOutlineLogout} from "react-icons/hi";
import { SiNamecheap } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { BsTextCenter } from "react-icons/bs";
import "../Css/UserScreen.css";
import { useEffect, useState } from "react";
import { auth,db } from "../Config/Config";
import L1 from "../Images/load.svg";
import { AiOutlineArrowLeft} from "react-icons/ai";

const UserScreen=()=>{
    const [namechange, setNameChange]= useState("");
    const [aboutchange, setAboutChange] = useState("");
    const [loggedInUserData, setLoggedInUserData]=useState("");
    const [namechangestyle, setNameChangeStyle]= useState("none");
    const [aboutchangestyle, setAboutChangeStyle]=useState("none")
    const [loading, setloading]=useState("");
    const [userId,setUserId]= useState("")   
    // const [phone, setPhone]= useState("") ;
    
    useEffect(()=>{
        if(loggedInUserData==="")
          setloading("block")
        else
          setloading("none")
    },[loggedInUserData])

    useEffect(()=>{
        
        auth.onAuthStateChanged((user) => {
            
            if (user) {
              
            //   console.log("20",user);
              // db.collection('UserData').where('phone', '==',user.phoneNumber).get()
              // .then((querySnapshot) => {
              //     db.collection('UserData').doc(querySnapshot.docs[0].id).get()
              //     .then(snapshot => setLoggedInUserData(snapshot.data()),setUserId(querySnapshot.docs[0].id))
                  
              // })
              db.collection("UserData").where("phone","==", user.phoneNumber)
              .onSnapshot((Snapshot)=>{
                // console.log(Snapshot)
                Snapshot.forEach((doc)=>{
                  setLoggedInUserData(doc.data());setUserId(doc.id);
                })
              })
            }
          })
    },[])

    const handleName=()=>{
        // e.preventDefault();
         if(namechangestyle==="none")
         setNameChangeStyle("block")
         else
         setNameChangeStyle("none")
      }
    
      const handleAbout=()=>{
        // e.preventDefault();
         if(aboutchangestyle==="none")
         setAboutChangeStyle("block")
         else
         setAboutChangeStyle("none")
      }

    // console.log("13", userId)
    const setusernametoFirestore=()=>{
        if(namechange!=="")
        db.collection("UserData").doc(userId).update({name: namechange});
        console.log(namechange)
        // setLoggedInUserData("")
        handleName();
    }

    const setuserAbouttoFirestore=()=>{
      if(aboutchange!=="")
      db.collection("UserData").doc(userId).update({about: aboutchange});
      console.log(aboutchange)
      // setLoggedInUserData("")
      handleAbout();
  }

  const [profileshow1, setprofileShow1]= useState("none");

     const profileshow = ()=>{
       if(profileshow1==="none")
        setprofileShow1("block")
        else
        setprofileShow1("none")
     }

    return(
        <>
        <NavigationBar addcol="userscreen"/>
        <div className="usercontrolMainContainer">
            
             <div className="userInfo" >
               
              
                <div className="userIMG" onClick={(e)=>{e.stopPropagation(); profileshow()}}>
                    {loggedInUserData.profileImg===""?(<img src={U1} alt="user" />):(<img src={loggedInUserData.profileImg} alt="user"/>)}
                    
                   
                </div>
                <div className="userName">
                
                <div className="name">
                    <p className="username1">{loggedInUserData.name}</p></div>
                {userId.about===""?(<p className="userAbout">About.</p>):(<p className="userAbout">{loggedInUserData.about}</p>)}
                </div>
                <div className="changename_style" style={{display:`${namechangestyle}`}}>
                <p>Enter your name</p>
                <input type="text" placeholder={`${loggedInUserData.name}`} className="namechange_input"  maxLength="25"  onChange={(e) => setNameChange(e.target.value)}></input>
                <div className="twoName_button"><button onClick={()=>setusernametoFirestore()}>Save</button> <button onClick={()=>handleName()}> Cancel</button></div>
               </div>
               <div className="changename_style" style={{display:`${aboutchangestyle}`}}>
                <p>Add About</p>
                <input type="text" placeholder={`${loggedInUserData.about}`} className="namechange_input"  maxLength="45" onChange={(e) => setAboutChange(e.target.value)} ></input>
                <div className="twoName_button"><button onClick={()=>setuserAbouttoFirestore()}>Save</button> <button onClick={()=>handleAbout()}> Cancel</button></div>
               </div>
                
            </div>
            
          
 
            <div className="updateUser">
                <div className="covercontainer" style={{display:`${namechangestyle}`}} onClick={(e)=>{e.stopPropagation();handleName()}}></div>
                <div className="covercontainer" style={{display:`${aboutchangestyle}`}} onClick={(e)=>{e.stopPropagation();handleAbout()}}></div>
                <div className="photochange"><CgProfile size="2.01rem" color="yellow" style={{ background: '#21313a' }}/><p>Add photo</p></div>
                <div className="photochange" onClick={(e)=>{e.stopPropagation();handleName()}}><SiNamecheap size="2rem" color="lightgreen"  style={{ background: '#21313a' }} /><p>Edit name</p></div>
                <div className="photochange" onClick={(e)=>{e.stopPropagation();handleAbout()}}><BsTextCenter size="1.9rem" color="lightblue"  style={{ background: '#21313a' }}/><p>Edit about</p></div>
                
                <div style={{display:`${loading}`}} className="loading"><img src={L1} alt="loading"/></div>
                <div className="photochange" ><HiOutlineLogout size="1.9rem" color="red"  style={{ background: '#21313a' }}/><p>Log out</p></div>
            </div>
            <div className="profileshow" style={{display:`${profileshow1}`}}>
            <p className="profileshowpara"> &nbsp;&nbsp;<AiOutlineArrowLeft size="1.4rem" onClick={(e)=>{e.stopPropagation(); profileshow()}}/>&nbsp; &nbsp; &nbsp;  Profile picture</p>
             <div className="profileshowIMG">
             {loggedInUserData.profileImg===""?(<img src={U1} alt="user" />):(<img src={loggedInUserData.profileImg} alt="user"/>)}
             </div>
          </div>
            
        </div>
    </>
    )
}
export default UserScreen;