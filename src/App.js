// import logo from './logo.svg';
import './App.css';
import { Login } from "./components/Pages/Auth/Login";
import { Register } from "./components/Pages/Auth/Register";
import HomeSearch from './components/Pages/Search/HomeSearch';
import PrivateRoutes from './utils/ProtectedRoutes';
import Subcodes from './components/Pages/subcodes/Subcodes';
import AddRules from './components/Pages/subcodes/AddRule';
import Users from './components/Pages/users/Users';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Import from './components/Pages/Import/ImportFile';
import Extract from './components/Pages/Import/ExtractData';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<HomeSearch />} />
            <Route path="/subcodes" element={<Subcodes />} />
            <Route path="/add-rules" element={<AddRules />} />
            <Route path="/users" element={<Users />} />
            <Route path="/import" element={<Import />} />
            <Route path="/extract" element={<Extract />} />
          </Route>
        </Routes> 
      </div>
    </Router>
  );
}

export default App;
