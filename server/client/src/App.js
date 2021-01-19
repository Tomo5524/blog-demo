import NavBar from "./components/nav";
import Home from "./components/home";
import Posts from "./components/posts";
import ShowPost from "./components/showPost";
import AddPost from "./components/addPost";
import Login from "./components/login";
import Signup from "./components/Sign-up";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="container">
        <NavBar />
        <Switch>
          {/* <Route exact path="/" component={<Home currentUser={currentUser} />} /> */}
          <Route exact path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/sign-up" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/add-post" component={AddPost} />
          <Route path="/:slug" component={ShowPost} />
          <Route path="/add-post/:id" component={AddPost} />
          {/* <Route path="/sign-up" component={Signup} /> for some reason, if signup component is here, showPost gets called first and causes an error */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
