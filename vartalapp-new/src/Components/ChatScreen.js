import { useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "../Css/ChatsScreen.css";
import U1 from "../Images/nouser.jpg"
import { db } from "../Config/Config";
import { useEffect, useState } from "react";
import { auth } from "../Config/Config";
import L1 from "../Images/load.svg";
import firebase from "@firebase/app-compat";
import { storage } from "../Config/Config";
import B1 from "../Images/bgWall.jpg";
import { AiOutlineSend } from "react-icons/ai";
import { TiAttachment } from "react-icons/ti"
import { MdOutlineCancel} from "react-icons/md";



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
            
            
      }
      else
      {
        db.collection("UserChats").doc(id).update({
          chats: firebase.firestore.FieldValue.arrayUnion({message:message, image: "", sender: userId, time:(a.toString())})  
        });
        setchatUpdate("again")
        
       document.getElementById("myMessage").reset();
        
      }
    }
    setShareImage("")
    setMessage("")
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
      document.getElementById("content").scrollIntoView();
      return ()=>{
        mounted=false
      }
    },[chatupdate, id])


  function tConvert (time) {
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { 
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ?  ' am' : ' pm'; 
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); 
  }

  const [messageimageshowstyle, setMessageimageshowstyle] = useState("none");
  const [onlyparticularimageshow, setOnlyparticularimageshow] = useState("")

  const handleMessageImageShow=(t)=>{
    
    if(messageimageshowstyle==="none"){
    setMessageimageshowstyle("block");
    setOnlyparticularimageshow(t)
    }
    else{
    setMessageimageshowstyle("none");
    setOnlyparticularimageshow("");
    }
  }
  

   
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
       {shareImage ? (<div className="shareImage"><p className="cancel_select_photo" onClick={()=>setShareImage("")}><MdOutlineCancel size="1.6rem"/></p> <img src={URL.createObjectURL(shareImage)} alt="shareImg" /> </div>):null}
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
          <div className="sendButton" onClick={()=>{handleMessage(Date(Date.now()))}}><AiOutlineSend size="2rem"/></div>
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
                    if(chats.sender===userId && chats.image==="" )
                      return (<div className="user" ><div id="user"><p >{chats.message}</p><p className="timeMessage">{tConvert(chats.time.slice(16,21))}</p></div></div>)
                    if(chats.sender!==userId && chats.image==="")
                      return (  <div className="sender"><p>{chats.message}</p><p className="timeMessage timemessage-receive">{tConvert(chats.time.slice(16,21))}</p></div>)
                    if(chats.sender===userId && chats.image!=="" && chats.message==="")
                    return ( <div className="messageimageCont" onClick={(e)=>{e.stopPropagation();handleMessageImageShow(chats.image)}}><div className=" message-image"><img src={chats.image} alt="message-im"/><div style={{textAlign:"right", fontSize:"0.79rem", color:"#b3c7c7", marginBottom:"0.3rem"}}>{tConvert(chats.time.slice(16,21))}</div></div>  </div>)
                    if(chats.sender!==userId && chats.image !=="" && chats.message==="")
                    return( <div className="messageimageContReceiver" onClick={(e)=>{e.stopPropagation();handleMessageImageShow(chats.image)}}><div className=" message-imageReceive"><img src={chats.image} alt="message-"/><div style={{textAlign:"left", fontSize:"0.79rem", color:"#b3c7c7", marginBottom:"0.3rem"}}>{tConvert(chats.time.slice(16,21))}</div></div></div> )
                    if(chats.sender===userId && chats.image!=="" && chats.message!=="")
                    return (<div className="messageimageBothContainer">
                      <div className="messageimageBothContainerColored">
                        <div className="messageimageBothContainerImage" onClick={(e)=>{e.stopPropagation();handleMessageImageShow(chats.image)}}>
                          <img src={chats.image} alt="messagetextimage" />
                        </div>
                        <p>{chats.message}</p>
                        <p style={{textAlign:"right", fontSize:"0.79rem", color:"#b3c7c7", marginBottom:"0.3rem"}}>{tConvert(chats.time.slice(16,21))}</p>
                      </div>
                    </div>)
                    if(chats.sender!==userId && chats.image!=="" && chats.message!=="")
                    return ( <div className="messageimageBothContainerReceived">
                       <div className="messageimageBothContainerColoredReceived">
                        <div className="messageimageBothContainerImageReceived" onClick={(e)=>{e.stopPropagation();handleMessageImageShow(chats.image)}}>
                          <img src={chats.image} alt="messagetextimagereceived" />
                        </div>
                        <p>{chats.message}</p>
                        <p style={{textAlign:"left", fontSize:"0.79rem", color:"#b3c7c7", marginBottom:"0.3rem"}}>{tConvert(chats.time.slice(16,21))}</p>
                      </div> 

                    </div> 
                    )
                  })()
                }
                
             </div>
             ))}

             <div id="content" ><p>End of your messages.</p></div>
         </div>
         
       </div>
       <div className="messageimage_show" style={{display:`${messageimageshowstyle}`}} >
       <p onClick={(e)=>{e.stopPropagation();handleMessageImageShow()}} className="imageclosebutton">Close</p>
        <div className="messageimage_showIndiseDIv"> {onlyparticularimageshow!=="" ? <img  src={onlyparticularimageshow} alt="" />: null}</div>
         
         </div>
      </div>
        
    
    </>
        )
}
export default ChatScreen;