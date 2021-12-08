import NavigationBar from "./NavigationBar";
import "../Css/MessageScreen.css";
import { useState, useEffect } from "react";
import {auth,db} from "../Config/Config";
import UserChatsDetails from "./UserChatDetails";

const MessageScreen=()=>{
    const [userId, setUserId]= useState("");
    const[allchats, setAllChats] = useState([]);

    useEffect(()=>{
        let mounted= true;    
        if(mounted){
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
          })}
          return ()=>{
            mounted=false;
          }
    
      },[])
    //   console.log(userId)
       
     useEffect(()=>{
         let mounted=true;
         if(mounted){
             db.collection("UserChats").where('participants', "array-contains", `${userId}`)
             .onSnapshot((snapshot)=>{
                 var array = [];
                 snapshot.forEach((doc)=>{
                    //  console.log("42",doc.id);
                     var ob = {...doc.data()};
                     ob.id = doc.id;
                      if(doc.data().chats.length>0){
                        array.push(ob);
                      }
                 })
                //  console.log("47",array);
                 setAllChats(array);
             })
         }
         return()=>{
             mounted=false;
         }
     },[userId])
    // console.log(allchats)
    return(
        <>
        <NavigationBar addcol="message"/>
        <div className="messageMainconatiner">
            {
                allchats.map((chat, key) => {
                    return (
                        <UserChatsDetails key={key} chat={chat}  userId={userId}/>
                    )
                })
            }
        </div>
    </>
    )
}
export default MessageScreen;