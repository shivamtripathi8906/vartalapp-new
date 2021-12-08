import './App.css';
import LoginScreen from './Components/LoginScreen';
import { BrowserRouter, Route} from 'react-router-dom';
import MessageScreen from './Components/MessageScreen';
import StatusScreen from './Components/StatusScreen';
import ContactScreen from './Components/ContactScreen';
import UserScreen from './Components/UserScreen';
import PhoneLoginScreen from './Components/PhoneLoginScreen';
import LoginForm from './Components/LoginForm';
import ChatScreen from './Components/ChatScreen';
function App() {
  return (
    <div className="App">
       <BrowserRouter>
         <Route exact path="/" component={LoginScreen}/>  
         <Route exact path="/messages" component={MessageScreen}/>
         <Route exact path="/status" component={StatusScreen}/>
         <Route exact path="/contacts" component={ContactScreen}/>
         <Route exact path="/user" component={UserScreen}/>
         <Route exact path="/phonelogin" component={PhoneLoginScreen}/>
         <Route exact path="/loginform" component={LoginForm}/>
         <Route exact path="/:id1/chats/:id" component={ChatScreen}/>
       </BrowserRouter>
    </div>
  );
}

export default App;
