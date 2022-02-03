import React from "react";
import "./App.css";
import Navbar from "./web app/Navbar"
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
// import the Container Component from the semantic-ui-react
import { Container } from "semantic-ui-react";
// import the ToDoList component
import "./App.css";
import PoolQuiz from "./web app/Pool-Quiz";
import SignUp from "./web app/SignUp";
import SignIn from "./web app/SignIn"

function App() {
  return (
      <Router>
          <div className={"App"}>
              <Navbar />
              <div>
                  <Switch>
                      <Route exact path={"/"}>
                          <PoolQuiz />
                      </Route>
                      <Route exact path={"/signUp"}>
                          <SignUp/>
                      </Route>
                      <Route exact path={"/signIn"}>
                          <SignIn />
                      </Route>
                  </Switch>
              </div>
          </div>
      </Router>
  );
}
export default App;