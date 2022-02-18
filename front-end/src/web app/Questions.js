import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Tab} from "semantic-ui-react";

const Questions = () => {
    const colors = '#02f8f8'

    const quiz = new Map();

    const state = {
        name: localStorage.getItem("name"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
        pool: localStorage.getItem("pool"),
        contribute: localStorage.getItem("contribute"),
        quick: localStorage.getItem("quick")
    };

    // let panes = [
    //     { menuItem: 'Round 1', render: () => <Tab.Pane>{setupQuestions()}</Tab.Pane> },
    //     { menuItem: 'Round 2', render: () => <Tab.Pane>{setupQuestions()}</Tab.Pane> },
    //     { menuItem: 'Round 3', render: () => <Tab.Pane>{setupQuestions()}</Tab.Pane> },
    // ]

    //let questions = [];
    const [question, setQuestion] = useState('');
    //let questionArray = [];

    const setupRounds = () => {
        const panes = [];
        const questionArray = [];
        for (let j = 1; j < state.noRounds+1; j++) {
            panes.push(
                {menuItem: 'Round '+j, render: () =>
                        <Tab.Pane>
                            <form onSubmit={addQuestions}>
                                {setupQuestions(questionArray)}
                                <button>Add Questions</button>
                            </form>
                        </Tab.Pane>}
            );
            quiz.set(j,questionArray);
        }
        console.log("After submit: ", questionArray)

        return panes
    }

    const addQuestions = (state) => {
        state.preventDefault()

        console.log()
    }

    const setupQuestions = (questionArray) => {
        const questions = [];
        let j = 0
        for (let i = 0; i < state.noQuestions; i++) {
            questions.push(
                <div>
                    <label>Question {i + 1}</label>
                    <input
                        id={i}
                        type={"text"}
                        name={"Round"+j+"Question" + i}
                        //"Round" + j +
                        required
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuestion({
                                ...question,
                                [e.target.name]: value
                            });
                        }}
                        //onChange={(e) => {alert("hello")}}
                        //questionsArray.push(e.target.value)
                    />
                </div>
            );
            questionArray.push(question);
            questions.map(question =>
                <li key={i}>{question}</li>);
            j += 1
        }

        return questions;
    }

    const TabExampleBasic = () => <Tab panes={setupRounds()}  className={"create"}/>

    const handleQuestions = () => {

    }

    const handleSubmit = (e) => {
        console.log(quiz)
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

    return (
        <div className="create">
            <h2>Almost there! Just need to enter the questions</h2>
            <h2>{state.name}</h2>
            {TabExampleBasic()}
            <form onSubmit={handleSubmit}>
                <br/>
                <button>Setup Quiz</button>
            </form>

        </div>
    );
}

export default Questions;