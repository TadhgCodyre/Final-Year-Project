import React, { useState } from "react";
import "./account.css"

const QuizSetup = () => {
    const state = {
        username: localStorage.getItem("username")
    }

    const [name, setName] = useState('');
    const [noRounds, setRounds] = useState(0);
    const [noQuestions, setQuestions] = useState(0);
    const [pool, setPool] = useState(false);
    const [contribute, setContribute] = useState(false);
    const [quick, setResponse] = useState(0);

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
            QuizName: name,
            NumberRounds: noRounds,
            NumberQuestions: noQuestions,
            QuestionPool: pool,
            ContributeQuestions: pool,
            QuickResponses: quick,
            PIN: ''+Math.floor(1000 + Math.random() * 9000)
        };

        console.log(quiz.QuickResponses);

        localStorage.setItem("name", quiz.QuizName, );
        localStorage.setItem("noRounds", quiz.NumberRounds.toString());
        localStorage.setItem("noQuestions", quiz.NumberQuestions.toString());
        localStorage.setItem("pin", quiz.PIN);

        fetch('http://localhost:9090/api/create-quiz', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quiz)
        }).then((response) => {
            if (!response.ok) {
                alert("Failed to create quiz")
            } else {
                console.log("quiz created")
                window.location.replace("/questions")
            }
        });


    };

    return (
        <div className="create">
            <h1>Welcome {state.username}!</h1>
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
                <label>Set the length of the quiz</label>
                <input
                    type="number"
                    required
                    value={quick}
                    onChange={(e) => setResponse(e.target.valueAsNumber)}
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
                <button>Setup Quiz</button>
            </form>
        </div>
    );
}

export default QuizSetup;