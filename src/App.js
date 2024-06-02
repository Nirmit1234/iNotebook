import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from './componenets/Navbar';
import Home from './componenets/Home';
import NoteState from './contexts/notes/NoteState';
import Alert from './componenets/Alert';
import SignUp from './componenets/SignUp';
import Login from './componenets/Login';
import { useState } from 'react';

function App() {
  const [alert,setAlert] = useState(null);
  const showAlert = (message,type) =>{
    setAlert({
      msg: message,
      type:type
    })
    setTimeout(() => {
      setAlert(null);
    },1500);
  }
  return (
  <>
    <NoteState>
      <Router>
          <Navbar/>
          <Alert alert={alert}/>
          <div className="container">
            <Switch>
                  <Route exact path="/">
                    <Home showAlert={showAlert}/>
                  </Route>
                  <Route exact path="/login">
                    <Login showAlert={showAlert}/>
                  </Route>
                  <Route exact path="/signup">
                    <SignUp showAlert={showAlert}/>
                  </Route>
            </Switch>
          </div>
      </Router>
    </NoteState>
  </> 
  );
}

export default App;
