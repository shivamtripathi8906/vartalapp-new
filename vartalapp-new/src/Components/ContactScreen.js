import NavigationBar from "./NavigationBar";
import C1 from "../Images/nouser.jpg";
import "../Css/ContactScreen.css";
import { useEffect, useState } from "react";
import { auth,db } from "../Config/Config";
import L1 from "../Images/load.svg"
import { Redirect } from "react-router-dom";
import { AiOutlineArrowLeft} from "react-icons/ai";

const ContactScreen=()=>{
    const [contactdata, setContactData]= useState([]);
    const [loading, setloading]=useState("");
    const [mainuserdataId, setMainUserDataId]= useState();
    const [redirectToChat, setRedirectToChat] = useState("");
    const [profileshow1, setprofileShow1]= useState("none");

    const profileshow = ()=>{
      if(profileshow1==="none")
         setprofileShow1("block")
      else
         setprofileShow1("none")
    }


    useEffect(()=>{
        auth.onAuthStateChanged((user) => { 
            if (user) {
              db.collection('UserData').where('phone', '==',user.phoneNumber).get() 
              .then((querySnapshot) => {
                // console.log(querySnapshot.docs)
                   db.collection('UserData').get()
                   .then(snapshot => setMainUserDataId(querySnapshot.docs[0].id))  
              })

              db.collection('UserData').where('phone', '!=',user.phoneNumber).get()
              .then((querySnapshot) => {
                // console.log(querySnapshot.docs)
                   db.collection('UserData').get()
                   .then(snapshot => setContactData(querySnapshot.docs))  
              })
            }
          })
    },[])

     useEffect(()=>{
      if(contactdata==="")
         setloading("block")
      else
         setloading("none")
     },[contactdata])

     const setUserChatstoFirestore=(e, id)=>{
       let uId=id;
        db.collection('UserChats').where('participants', "array-contains", `${mainuserdataId}`).get()
            .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                   let flag=0;
                   let chatID=100;
                   for(let i=0;i<querySnapshot.size;i++)
                   {
                       if((querySnapshot.docs[i].data().participants[0]===mainuserdataId && querySnapshot.docs[i].data().participants[1]===id) || (querySnapshot.docs[i].data().participants[0]===id && querySnapshot.docs[i].data().participants[1]===mainuserdataId)){
                            chatID=i; 
                            flag=1;
                            break;
                       }
                          
                   }
                   if(flag===0)
                   {
                      db.collection("UserChats").add({
                         chats:[],
                         participants:[mainuserdataId,uId]
                      })
                      .then(
                          db.collection('UserChats').where('participants', "==", [`${mainuserdataId}`,`${id}`]).get()
                          .then((querySnapshot) => {
                              setRedirectToChat(`/contacts/chats/${querySnapshot.docs[0].id}`)
                          }))
                   } 
                   else
                   {setRedirectToChat(`/contacts/chats/${querySnapshot.docs[chatID].id}`)}
                 }
                    else {
                        db.collection("UserChats").add({
                            chats:[],
                            participants:[mainuserdataId,uId]
                          })
                        .then(
                          db.collection('UserChats').where('participants', "==", [`${mainuserdataId}`,`${id}`]).get()
                          .then((querySnapshot) => {
                            setRedirectToChat(`/contacts/chats/${querySnapshot.docs[0].id}`)
                            // console.log(querySnapshot)
                          
                          }))}
                        // console.log("not present")}
                    
                    
                  })

     }
    
    return(
        <>
        <NavigationBar addcol="contact"/>
        {redirectToChat!==""? <Redirect to={redirectToChat} />: null }
        <div className="mainContactCont">
          
           {contactdata.map((contact, key)=>(
              <div className="showUserContact" key={key} onClick={(e)=>{setUserChatstoFirestore(e,contact.id)}} >
              <div className="contactPhoto" onClick={(e)=>{e.stopPropagation(); profileshow()}}> 
                {contact.data().profileImg===""?(<img src={C1} alt="user"/>):(<img src={contact.data().profileImg} alt="contact"/>)}
              </div>
              <div className="contactDetails">
               <p className="username1">{contact.data().name}</p>
               {contact.data().about===""?(<p className="userAbout">Userstatus</p>):(<p className="userAbout">{contact.data().about}</p>)}
               </div>
               <div className="profileshow" style={{display:`${profileshow1}`}}>
            <p className="profileshowpara"> &nbsp;&nbsp;<AiOutlineArrowLeft size="1.4rem" onClick={(e)=>{e.stopPropagation(); profileshow()}}/>&nbsp; &nbsp; &nbsp;  Profile picture</p>
             <div className="profileshowIMG">
             {contact.data().profileImg===""?(<img src={C1} alt="user"/>):(<img src={contact.data().profileImg} alt="contact"/>)}
             </div>
          </div>
              </div>
              
           ))}
            
          <div  className="loading" style={{display:`${loading}`}}><img src={L1} alt="loading"/></div>   
          
        </div>
       
    </>
    )
}
export default ContactScreen;