import NavBar from "./components/nav";
import Home from "./components/home";
import Posts from "./components/posts";
import ShowPost from "./components/showPost";
import AddPost from "./components/addPost";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="container">
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/add-post" component={AddPost} />
          <Route path="/:slug" component={ShowPost} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
