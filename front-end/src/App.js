import React from "react";
import "./App.css";
import Navbar from "./web app/Navbar";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.css";

import PoolQuiz from "./web app/Pool-Quiz";
import SignUp from "./web app/SignUp";
import SignIn from "./web app/SignIn";
import QuizSetup from "./web app/QuizSetup";
import Questions from "./web app/Questions";
import Quiz from "./web app/Quiz"

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
                      <Route exact path={"/quizSetup"}>
                          <QuizSetup />
                      </Route>
                      <Route exact path={"/questions"}>
                          <Questions />
                      </Route>
                      <Route exact path={"/quiz"}>
                          <Quiz />
                      </Route>
                  </Switch>
              </div>
          </div>
      </Router>
  );
}
export default App;