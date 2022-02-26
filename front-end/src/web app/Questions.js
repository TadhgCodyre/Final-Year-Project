import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Form, Tab} from "semantic-ui-react";

const Questions = () => {
    const quiz = new Map();
    let questionMap = [];

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
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('');

    //let questionArray = [];

    const TabExampleBasic = () => <Tab panes={setupRounds()} onTabChange={() => {
        Array.from(document.querySelectorAll("input")).forEach(input => (input.value = ""));

        Array.from(document.querySelectorAll('input[type=radio]:checked')).forEach(response => response.checked = false);
    }}/>

    const setupRounds = () => {
        const panes = [];

        for (let j = 1; j < state.noRounds+1; j++) {
            // Array.from(document.querySelectorAll("input")).forEach(
            //     input => (input.value = "")
            // )
            panes.push(
                {menuItem: 'Round '+j, render: () =>
                        <Tab.Pane>
                            {setupQuestions(j)}
                        </Tab.Pane>
                }
            );
        }

        return panes
    }

    const setupQuestions = (j) => {
        const questions = [];

        for (let i = 1; i < state.noQuestions+1; i++) {
            questions.push(
                    <Form>
                        {/*<label>Question {i + 1}</label>*/}
                        <Form.Input
                            fluid label={"Question "+i}
                            type={"text"}
                            name={"Round"+j+"Question" + i}
                            //required
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuestion({
                                    ...question,
                                    [e.target.name]: value
                                });
                            }}
                        />
                        <Form.Group widths={"equal"}>
                            {makeAnswers(i, j)}
                        </Form.Group>
                        <Form.Group>
                            <label>Response</label>
                            {makeRadios(i, j)}
                        </Form.Group>
                    </Form>
            );
            questions.map(question =>
                <li key={j}>{question}</li>);
        }

        return questions;
    }

    const makeRadios = (i, j) => {
        const radioArray = [];

        for (let z = 1; z < 5; z++) {
            radioArray.push(
                <Form.Radio
                    label={'Answer '+z}
                    type={"radio"}
                    id={"Round"+j+"Question"+i+"AnswerResponse"+z}
                    name={"Round"+j+"Question"+i+"AnswerResponse"}
                    //checked={response1}
                    onChange={(e) => {onChangeValue(e)}}
                />
            );
            radioArray.map(response =>
                <li key={z}>{response}</li>);
        }
        return radioArray;
    }

    const onChangeValue = (event) => {
        //Array of [event.target.id], get last character, (a number), use this number to set value in boolean array as true
        setResponse({
            ...response,
            [event.target.name]: event.target.id
        });
    }

    const makeAnswers = (i, j) => {
        const answerArray = [];

        for (let z = 1; z < 5; z++){
            answerArray.push(
                <Form.Input
                    fluid label={'Answer '+z}
                    name={"Round"+j+"Question"+i+"Answer"+z}
                    //required
                    type={"text"}
                    onChange={(e) => {
                        const value = e.target.value;
                        setAnswer({
                            ...answer,
                            [e.target.name]: value
                        });
                    }}
                />
            );
            answerArray.map(answer =>
                <li key={z}>{answer}</li>);
        }

        return answerArray;
    }

    const setupResponses = () => {
        // Gets all the responses from the radios
        const correctResponse = [];

        // Holds all the arrays with the correct and wrong responses
        let responseMap = new Map();

        // Get the correct response, set the correct answer
        for (const val of Object.values(response)) {
            correctResponse.push(parseInt(val.toString().slice(val.length - 1))-1);
        }
        //console.log("correctResponses: ", correctResponse);

        // Populate arrays with false answers
        for (let i = 0; i < (state.noQuestions*state.noRounds); i++) {
            responseMap.set(i, [false, false, false, false]);
            let temp = responseMap.get(i);

            // Set correct answer
            //console.log("temp[correctResponse[i]]: ", temp[correctResponse[i]]);
            temp[correctResponse[i]] = !temp[correctResponse[i]];

            // Return to map
            responseMap.set(i, temp);
        }

        return responseMap;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        //console.log(response)
        const responseArray = setupResponses()
        const answerMap = setupAnswers();
        //console.log(answer);

        // Get questions from question object
        // Parse into respective rounds
        let questionTrack = 0;
        let roundTrack = 0;
        for (const val of Object.values(question)) {
            questionMap.push(val);
            questionTrack += 1;

            if ((questionTrack % state.noQuestions === 0) && (questionTrack !== 0)) {
                quiz.set(roundTrack, questionMap);
                questionMap = [];
                roundTrack += 1;
            }
        }
        //console.log(quiz)

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

    const setupAnswers = () => {

    }

    return (
        <div className="create">
            <h2>Almost there! Just need to enter the questions</h2>
            <h2>{state.name}</h2>
            {TabExampleBasic()}
            <br/>
            <button onClick={handleSubmit}>Setup Quiz</button>

        </div>
    );
}

export default Questions;