import Import from "../components/Pages/Import/ImportFile"; 
import { Login } from "../components/Pages/Auth/Login";
import { Register } from "../components/Pages/Auth/Register";
import HomeSearch from "../components/Pages/Search/HomeSearch" 

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
  }
];
export default routesData;