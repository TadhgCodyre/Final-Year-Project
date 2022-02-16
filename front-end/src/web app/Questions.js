import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Tab, Tabs} from "react-bootstrap";
import {Form} from "semantic-ui-react";

const Questions = () => {
    const quiz = new Map();

    const state = {
        name: localStorage.getItem("name"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
        pool: localStorage.getItem("pool"),
        contribute: localStorage.getItem("contribute"),
        quick: localStorage.getItem("quick")
    };

    const questionArray = [];
    const questions = [];
    const [question, setQuestion] = useState('');

    const setupQuestions = () => {
        console.log("setup")
        //map[noRounds][noQuestions]QuestionMap
        let question = '';
        for (let j = 0; j < state.noRounds; j++){
            for (let i = 0; i < state.noQuestions; i++){
                questions.push(
                    <div className={"create"}>
                        <label>Question {i+1}</label>
                        <input
                            id={i}
                            type={"text"}
                            //required
                            onChange={(e) => {console.log(e.target.value); setQuestion(e.target.value)}}
                            //onChange={(e) => {alert("hello")}}
                            //questionsArray.push(e.target.value)
                        />
                    </div>
                );
                questionArray.push(question)
                //
                questions.map(question =>
                    <li key={i}>{question}</li>);
                quiz.set(1, questionArray)
            }
        }
        console.log(quiz);
        return questions
    }

    const handleQuestions = () => {

    }

    const handleSubmit = (e) => {
        // const submit = {
        //     Name: state.name,
        //     Questions: quiz
        // }
        e.preventDefault()
        // fetch('http://localhost:9090/api/quiz-setup', {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(submit)
        // }).then(() => {
        //     console.log('new blog added');
        //     //go to next page
        //     //window.location.replace("/quizSetup")
        // })
    }

    //window.onload = setupQuestions();

    return (
        <div className="create">
            <h2>Almost there! Just need to enter the questions</h2>
            <h2>{state.name}</h2>
            {setupQuestions()}
            <form onSubmit={handleSubmit}>

                <br/>
                <button>Setup Quiz</button>
            </form>

        </div>
    );
}

export default Questions;