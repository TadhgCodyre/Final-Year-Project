import { render, screen } from '@testing-library/react';
import App from './App';
import PoolQuiz from "./web app/Pool-Quiz";
import {mount, shallow} from "enzyme";
import Questions from "./web app/Questions";
import Quiz from "./web app/Quiz";
import QuizSetup from "./web app/QuizSetup";
import SignIn from "./web app/SignIn";
import SignUp from "./web app/SignUp";
import Leaderboard from "./web app/Leaderboard";

describe("<App />", () => {
  it("App renders without crashing", () => {
    shallow(<App />);
  });
});

// Tests for PoolQuiz
describe("<PoolQuiz />", () => {
  it("Homepage renders without crashing", () => {
    shallow(<PoolQuiz />);
  });
});

// Tests for Questions
describe("<Questions />", () => {
  it("Questions renders without crashing", () => {
    shallow(<Questions />);
  });
});

// Tests for Quiz
describe("<Quiz />", () => {
  it("Quiz renders without crashing", () => {
    shallow(<Quiz />);
  });
});

// Tests for QuizSetup
describe("<QuizSetup />", () => {
  it("QuizSetup renders without crashing", () => {
    shallow(<QuizSetup />);
  });
});

// Tests for SignIn
describe("<SignIn />", () => {
  it("SignIn renders without crashing", () => {
    shallow(<SignIn />);
  });
});

// Tests for SignUp
describe("<SignUp />", () => {
  it("SignUp renders without crashing", () => {
    shallow(<SignUp />);
  });
});

// Tests for Leaderboard
describe("<Leaderboard />", () => {
  it("SignUp renders without crashing", () => {
    shallow(<Leaderboard />);
  });
});