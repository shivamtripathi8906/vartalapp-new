import NavigationBar from "./NavigationBar";

const StatusScreen=()=>{
    return(
        <>
        <NavigationBar addcol="status"/>
        <p style={{color:"white",fontSize:"1.2rem",  display:"flex", justifyContent:"center", alignItems: "center", height:"100vh", textAlign:"center", padding:"0 0.5rem 0 0.5rem"}}>Hey! We are cooking it up for you...&nbsp;  </p>
    </>
    )
}
export default StatusScreen;