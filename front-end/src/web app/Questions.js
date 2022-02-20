import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Tab} from "semantic-ui-react";

const Questions = () => {
    const colors = '#02f8f8'

    const quiz = new Map();
    let questionMap = new Map();

    const state = {
        name: localStorage.getItem("name"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
        pool: localStorage.getItem("pool"),
        contribute: localStorage.getItem("contribute"),
        quick: localStorage.getItem("quick")
    };

    //let questions = [];
    const [question, setQuestion] = useState('');
    //let questionArray = [];

    const TabExampleBasic = () => <Tab panes={setupRounds()}  className={"create"}/>

    const setupRounds = () => {
        const panes = [];

        for (let j = 0; j < state.noRounds; j++) {
            panes.push(
                {menuItem: 'Round '+j, render: () =>
                        <Tab.Pane>
                            <form onSubmit={addQuestions}>
                                {setupQuestions(j)}
                                <button>Add Questions</button>
                            </form>
                        </Tab.Pane>}
            );
            quiz.set(j, questionMap)
            //for (let member in question) delete question[member]
        }

        return panes
    }

    const setupQuestions = (j) => {
        const questions = [];

        //question.substring(0, question.indexOf(question));

        for (let i = 0; i < state.noQuestions; i++) {
            questions.push(
                <div>
                    <label>Question {i + 1}</label>
                    <input
                        id={i}
                        type={"text"}
                        name={"Round"+j+"Question" + i}
                        //"Round" + j +
                        //required
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuestion({
                                ...question,
                                [e.target.name]: value
                            });
                        }}
                    />
                </div>
            );
            questionMap.set(i,question)

            questions.map(question =>
                <li key={j}>{question}</li>);
        }
        //console.log(question)

        return questions;
    }

    const addQuestions = (e) => {
        e.preventDefault()
        console.log(question)
        let temp = JSON.stringify(question)
        let tempArray = temp.replace('{', '')
        tempArray = tempArray.replace('}', '')
        let tempArray1 = tempArray.split(",")
        if (tempArray1.length > 2) {
            for (let i = 0; i < 2; i++) {
                tempArray1.shift()
            }
        }
        console.log(tempArray1)
        // for (let i = 0; i < question.length; i++) {
        //     questionMap.set(i, question)
        // }
        console.log(questionMap)
        //for (let member in question) delete question[member]
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