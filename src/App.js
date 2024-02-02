// import logo from './logo.svg';
import './App.css';
import { Login } from "./components/Pages/Auth/Login";
import { Register } from "./components/Pages/Auth/Register";
import HomeSearch from './components/Pages/Search/HomeSearch';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomeSearch />} />
        </Routes> 
      </div>
    </Router>
  );
}

export default App;
