import React, { useState } from "react";
import "./account.css"
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import Questions from "./Questions";
import ReactDOM from "react-dom";
import App from "../App";

const QuizSetup = () => {
    const [name, setName] = useState('');
    const [noRounds, setRounds] = useState(0);
    const [noQuestions, setQuestions] = useState(0);
    const [pool, setPool] = useState(false);
    const [contribute, setContribute] = useState(false);
    const [quick, setResponse] = useState(false);

    const handlePoolChange = () => {
        setPool(!pool)
    };

    const handleContributeChange = () => {
        setContribute(!contribute)
    };

    const handleResponseChange = () => {
        setResponse(!quick)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const quiz = {
            Name: name,
            NumberRounds: noRounds,
            NumberQuestions: noQuestions,
            QuestionPool: pool,
            ContributeQuestions: pool,
            QuickResponses: quick };

        console.log(quiz);

        // fetch('http://localhost:9090/api/quiz-setup', {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //     body: JSON.stringify(quiz)
        // }).then(() => {
        //     console.log('new quiz created');
        //     // go to questions page
        //     window.location.replace("/questions")
        // })

        localStorage.setItem("name", quiz.Name, );
        localStorage.setItem("noRounds", quiz.NumberRounds.toString());
        localStorage.setItem("noQuestions", quiz.NumberQuestions.toString());
        localStorage.setItem("pool", quiz.QuestionPool.toString());
        localStorage.setItem("contribute", quiz.ContributeQuestions.toString());
        localStorage.setItem("quick", quiz.QuickResponses.toString());

        window.location.replace("/questions")
    };

    return (
        <div className="create">
            <h2>Time to setup the quiz!</h2>
            <form onSubmit={handleSubmit}>
                <label>Quiz Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>No. of Rounds</label>
                <input
                    type="number"
                    required
                    value={noRounds}
                    onChange={(e) => setRounds(e.target.valueAsNumber)}
                />
                <label>No. of Questions</label>
                <input
                    type="number"
                    required
                    value={noQuestions}
                    onChange={(e) => setQuestions(e.target.valueAsNumber)}
                />
                <label>Use Pool of questions?</label>
                <input
                    type="checkbox"
                    checked={pool}
                    onChange={handlePoolChange}
                />
                <label>Contribute Questions to Pool?</label>
                <input
                    type="checkbox"
                    checked={contribute}
                    onChange={handleContributeChange}
                />
                <label>Encourage Quick Response?</label>
                <input
                    type="checkbox"
                    checked={quick}
                    onChange={handleResponseChange}
                />
                <button>Setup Quiz</button>
            </form>
        </div>
    );
}

export default QuizSetup;