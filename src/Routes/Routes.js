import Import from "../components/Pages/Import/index"; 
import AddColumnRules from "../components/Pages/Import/AddColumnRules"; 
import ExtractedData from "../components/Pages/Import/ExtractData"; 
import Subcodes from "../components/Pages/subcodes/subcodes"; 
import AddRules from "../components/Pages/subcodes/AddRule"; 
import Login from "../components/Pages/Login/Login";
import Register from "../components/Pages/Login/Register";
import HomeSearch from "../components/Pages/HomeSearch"; 
import { Login } from "../components/Pages/Auth/Login";
import { Register } from "../components/Pages/Auth/Register";

const routesData = [
  {
    path: "login",
    element: <Login />,
    title: "login"
  },
  {
    path: "register",
    element: <Register />,
    title: "register"
  },
  {
    path: "/home",
    element: <HomeSearch />,
    title: "home"
  },
  // {
  //   path: "/search",
  //   element: <Search />,
  //   title: "search"
  // },
  {
    path: "/import",
    element: <Import />,
    title: "import"
  },
  {
    path: "/add-column",
    element: <AddColumnRules />,
    title: "addcolumn"
  },,
  {
    path: "/extract",
    element: <ExtractedData />,
    title: "extractdata"
  }, 
  {
    path: "/subcodes",
    element: <Subcodes />,
    title: "subcodes"
  },
  {
    path: "/add-rules",
    element: <AddRules />,
    title: "addrules"
  }
];
export default routesData;