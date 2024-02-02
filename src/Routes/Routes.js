// import Login from "../components/Login";
// import Register from "../components/Register"; 
import Import from "../components/Pages/Import/index"; 
import AddColumnRules from "../components/Pages/Import/AddColumnRules"; 
import Subcodes from "../components/Pages/subcodes/index"; 
import AddRules from "../components/Pages/subcodes/AddRule"; 
import Login from "../components/Pages/Login/Login";
import Register from "../components/Pages/Login/Register";
import HomeSearch from "../components/Pages/HomeSearch"; 

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
    path: "/",
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