import { useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "../Css/ChatsScreen.css";
import U1 from "../Images/nouser.jpg"
import { db } from "../Config/Config";
import { useEffect, useState } from "react";
import { auth } from "../Config/Config";
import L1 from "../Images/load.svg";
// import { GrAttachment } from "react-icons/gr";
import firebase from "@firebase/app-compat";
import { storage } from "../Config/Config";
import B1 from "../Images/bgWall.jpg";
import { AiOutlineSend } from "react-icons/ai";
import { TiAttachment } from "react-icons/ti"



const ChatScreen=(props)=>{
  const id= props.match.params.id;

  const [userId, setUserId]= useState("");
  const [tochat, setToChat] = useState("");
  const [tochatdata, setToChatData] = useState("")
  const [loading, setloading]=useState("block");
  const [shareImage, setShareImage] = useState("");
  const [message, setMessage]= useState("");
  const [chatupdate, setchatUpdate] = useState("");
  const [allchats, setAllChats] = useState("")



  useEffect(()=>{
    let mounted= true;    
    auth.onAuthStateChanged((user) => {
        
        if (user) {
          
        //   console.log("20",user);
          db.collection('UserData').where('phone', '==',user.phoneNumber).get()
          .then((querySnapshot) => {
            // setUserId(querySnapshot.docs[0].id)})
            if(mounted){
              setUserId(querySnapshot.docs[0].id)
            }})
            
            
          
        }
      })
      return ()=>{
        mounted=false;
      }

  },[])


   useEffect(()=>{
     let mounted=true;
     if(mounted){
      db.collection("UserChats").doc(id).get()
      .then((snapshot)=>{
        let toChat=0;
        if(mounted){
        for(let i=0;i<2;i++)
        {
        if(snapshot.data().participants[i]===userId)
        
           toChat=snapshot.data().participants[1-i];
        }
        setToChat(toChat);}
        if(mounted){
        if(tochat === 0 || tochat===""){return;}else{
          db.collection("UserData").doc(tochat).get()
           .then((querySnapshot)=>{
             setToChatData(querySnapshot.data());
             setloading("none");
           })}
           
        }
      })
     }
     
      return ()=>{
        mounted=false
      }
      
   })
  
    useEffect(()=>{
      let mounted= true;
      if(mounted){
      var element = document.getElementById("yourDIVID");
      element.scrollTop = element.scrollHeight;}
      return()=>{
        mounted=false;
      }
    },[loading])

   

    let history = useHistory();
    const goToPreviousPath = () => {
        history.push(`/${props.match.params.id1}`)
    }

    const handlePhotoChange = (e) => {
      const image = e.target.files[0];
      if (image === "" || image===undefined) {
        console.log(e.error.message);
        return;
      }
      setShareImage(image);
    };

    const handleMessage=(a)=>{
      let mounted=true;
      if(mounted){
      // console.log(a.toString());
      if (shareImage){
        const upload = storage
              .ref(`chatImage/${shareImage.name}`)
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
                db.collection("UserChats").doc(id).update({
                    chats: firebase.firestore.FieldValue.arrayUnion({message:message, image: downloadURL, sender: userId, time:(a.toString())})  
                });
              }
            );
            setchatUpdate("again");
            
    document.getElementById("myMessage").reset();
            //  setMessage("")
            setShareImage("")
      }
      else
      {
        db.collection("UserChats").doc(id).update({
          chats: firebase.firestore.FieldValue.arrayUnion({message:message, image: "", sender: userId, time:(a.toString())})  
        });
        setchatUpdate("again")
        
    document.getElementById("myMessage").reset();
        setShareImage("")
      }
    }
    document.getElementById("content").scrollIntoView();
    return ()=>{
      mounted=false
    }
      
    }
    // console.log(message)
    useEffect(()=>{
      let mounted= true;
      if(mounted){
      db.collection("UserChats").doc(id)
      .onSnapshot((doc)=>{
        setAllChats(doc.data().chats)
      })}

      return ()=>{
        mounted=false
      }
    },[chatupdate, id])

  //  console.log(allchats)
   
    return(
        <>
      <div className="mainChatContainer">
       <div className="headingChatContainer">
         <div className="backConatiner" onClick={ goToPreviousPath}>
           <p><AiOutlineArrowLeft size="1.4rem"style={{marginTop:"5px"}}/></p>
           {tochatdata.profileImg==="" ?(<img src={U1} alt="user" />): (<img src={tochatdata.profileImg} alt="user" />)}
         </div>
         <p className="tochatName">{tochatdata.name}</p>
       </div>
       
       <div style={{display:`${loading}`}} className="loading"><img src={L1} alt="loading"/></div>
       {shareImage ? (<div className="shareImage"> <img src={URL.createObjectURL(shareImage)} alt="shareImg" /> </div>):null}
       <form id="myMessage"> 
       <div className="typeMessageContainer">
       {/* <form id="myMessage"> */}
          <div className="typeMessagebox1">
            
            <textarea name="message" id="box4444" placeholder="Message" onChange={(e) => setMessage(e.target.value)}></textarea>
            <input
                 type="file"
                 accept="image/gif, image/jpeg ,image/png"
                 name="image"
                 id="file"
                 multiple={false}
                 style={{ display: "none" }}
                 onChange={handlePhotoChange}
              />
              <label htmlFor="file"  >
            <TiAttachment size="1.6rem"  color="white" style={{ marginTop:"0.2rem"}}/></label>
          </div>
          
    {message.length>0 || shareImage?
          <div className="sendButton" onClick={()=>handleMessage(Date(Date.now()))}><AiOutlineSend size="2rem"/></div>
          : <p>Type</p>
       
    }
       </div></form>
       <div className="showMessageContainer"  style={{backgroundImage:`url(${B1})`}}>
         <div className="floatingMessageContainer" id="yourDIVID">
           
           {allchats.length>0 && 
             allchats.map((chats, key)=>(
               <div className="messageContainer" key={key}>
                {/* { chats.sender===userId  ? (<div className="user" ><p id="user">{chats.message}</p></div>):( <div className="sender">{chats.message}</div>)} */}
                {
                  (()=>{
                    if(chats.sender===userId && chats.image===""){
                      return (<div className="user" ><p id="user">{chats.message}</p></div>)
                    }
                    if(chats.sender!==userId && chats.image===""){
                      return (  <div className="sender">{chats.message}</div>)
                    }
                    if(chats.sender===userId && chats.image!=="")
                    return ( <div className="messageimageCont"><div className=" message-image"><img src={chats.image} alt="imagemessage"/></div></div>)
                    if(chats.sender!==userId && chats.image !=="")
                    return( <div className="messageimageContReceiver"><div className=" message-imageReceive"><img src={chats.image} alt="imagemessage"/></div></div> )
                  
                  })()
                }
             </div>
             ))}

             <div id="content" ><p>End of your messages.</p></div>
         </div>
         
       </div>
      </div>
        
    
    </>
        )
}
export default ChatScreen;