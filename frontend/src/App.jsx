import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Main from "./pages/Main.jsx";
import Java from "./play/Java.jsx";
import Python from "./play/Python.jsx";
import Javascript from "./play/Javascript.jsx";
import Cplusplus from "./play/C++.jsx";
import Csharp from "./play/Csharp.jsx";
import Brainrot from "./play/Brainrot.jsx";
import Summary from "./pages/Summary.jsx";
import Profile from "./pages/Profile.jsx";




function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />

        <Route path="/java" element={<Java/>} />
        <Route path="/python" element={<Python />} />
        <Route path="/javascript" element={<Javascript/>} />
        <Route path="/c++" element={<Cplusplus/>} />
        <Route path="/csharp" element={<Csharp/>} />
        <Route path="/brainrot" element={<Brainrot/>} />
        <Route path="/summary" element={<Summary/>} />
        <Route path="/profile" element={<Profile />} />
        

        
      </Routes>
    </BrowserRouter>
    
  );
}


export default App;
