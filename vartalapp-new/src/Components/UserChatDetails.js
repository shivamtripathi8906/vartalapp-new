 import U1 from "../Images/nouser.jpg" ;
import { useEffect, useState } from "react";
import { db } from "../Config/Config";
import { Redirect } from "react-router-dom";

const UserChatsDetails=(props)=>{
//   console.log(props.chat.id);
  const [url, setURL] =useState("")
  const[displayuser, setDisplayUser] = useState("")

  useEffect(()=>{
   let mounted= true;

   if(mounted){
   let displayUserID="";
    if(props.chat.participants[0]===props.userId)
    displayUserID=props.chat.participants[1];
    if(props.chat.participants[1]===props.userId)
    displayUserID=props.chat.participants[0];

    // setDisplayUser(displayUserID)

    if(displayUserID!==""){
        db.collection("UserData").doc(displayUserID).get()
        .then((snap)=>{
            setDisplayUser(snap.data())
        })
    }}

    return()=>{
        mounted=false;
    }
  })

//    console.log(displayuser)
  const setRedirect=(url)=>{
     let mounted=true
      if(mounted){
    setURL(`/messages/chats/${url}`)
      }
      return()=>{
          mounted=false
      }
  }

    return(
        <>
        {url!==""? <Redirect to={url}/>:null}
        <div className="mainUserConatinerMessage">
        <div className="messageContactConatiner" onClick={()=>setRedirect(props.chat.id)}>
                <div className="messageUserImg"><img src={U1} alt="" /></div>
                <div className="messageUserDetails"><p>{displayuser.name}</p><p style={{fontSize:"0.85rem"}}>
                {
                    props.chat.chats.length > 0 ? props.chat.chats[props.chat.chats.length-1].message : ''
                }</p></div>
            </div>
            </div>
        </>
    )
}
export default UserChatsDetails;