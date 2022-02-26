import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Form, Tab} from "semantic-ui-react";

const Questions = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('');

    // Getting the user submitted information
    const state = {
        name: localStorage.getItem("name"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
        pool: localStorage.getItem("pool"),
        contribute: localStorage.getItem("contribute"),
        quick: localStorage.getItem("quick")
    };

    //
    const TabExampleBasic = () => <Tab panes={setupRounds()} onTabChange={() => {
        Array.from(document.querySelectorAll("input")).forEach(input => (input.value = ""));
        Array.from(document.querySelectorAll('input[type=radio]:checked')).forEach(response => response.checked = false);
    }}/>

    const setupRounds = () => {
        const panes = [];

        for (let j = 1; j < state.noRounds+1; j++) {
            panes.push(
                {menuItem: 'Round '+j, render: () =>
                        <Tab.Pane>
                            {makeQuestions(j)}
                        </Tab.Pane>
                }
            );
        }

        return panes
    }

    const makeQuestions = (j) => {
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

    // Parses response object
    const setupResponses = () => {
        // Gets all the responses from the radios
        const correctResponse = [];

        // Holds all the arrays with the correct and wrong responses
        let responseMap = new Map();

        // Get the correct response, set the correct answer
        for (const val of Object.values(response)) {
            correctResponse.push(parseInt(val.toString().slice(val.length - 1))-1);
        }

        // Populate arrays with false answers
        for (let i = 0; i < (state.noQuestions*state.noRounds); i++) {
            // Create the necessary response arrays
            responseMap.set(i, [false, false, false, false]);

            // Temporary array to hold response array
            let temp = responseMap.get(i);

            // Set correct answer
            temp[correctResponse[i]] = !temp[correctResponse[i]];

            // Return to map
            responseMap.set(i, temp);
        }

        return responseMap;
    }

    // Parses answers object
    const setupAnswers = () => {
        const answerMap = new Map();
        let answerArray = [];

        let qTrack = 0;
        let roundTrack = 0;
        for (const val of Object.values(answer)) {
            answerArray.push(val);
            qTrack += 1;

            if ((qTrack % 4 === 0) && (qTrack !== 0)) {
                answerMap.set(roundTrack, answerArray);
                answerArray = [];
                roundTrack += 1;
            }
        }

        return answerMap
    }

    // Parses questions object
    const setupQuestions = () => {
        const questionMap = new Map();

        // Parse into respective rounds
        let questionTrack = 0;
        // Go through each value in question object
        for (const val of Object.values(question)) {
            questionMap.set(questionTrack, val);
            questionTrack += 1;
        }

        return questionMap;
    }

    // Combines answer and response maps into one
    const combineAnswerResponse = (responseMap, answerMap) => {
        // Combine the answer and response maps into one
        const answerResponseMap = new Map();

        for (let i = 0; i < (state.noQuestions*state.noRounds); i++) {
            let tempAnswer = answerMap.get(i);
            let tempResponse = responseMap.get(i);
            let tempMap = new Map();

            for (let j = 0; j < 4; j++) {
                //console.log(tempMap);
                tempMap.set(tempAnswer[j], tempResponse[j]);
            }

            answerResponseMap.set(i, tempMap);
        }
        //console.log(Object.fromEntries(answerResponseMap));

        return answerResponseMap;
    }

    // Combines Questions, Answer and Responses into one map
    const combineQuestionAnswerResponse = (questionMap, answerResponseMap) => {
        const questionAnswerResponseMap = new Map();
        for(let i = 0; i < (state.noQuestions*state.noRounds); i++) {
            let tempMap = new Map();
            tempMap.set(questionMap.get(i), answerResponseMap.get(i));
            questionAnswerResponseMap.set(i, tempMap);
        }
        //console.log(Object.fromEntries(questionAnswerResponseMap));

        return questionAnswerResponseMap;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Functions to get questions, answers and responses from their respective objects
        const responseMap = setupResponses()
        const answerMap = setupAnswers();
        const questionMap = setupQuestions();

        const answerResponseMap = combineAnswerResponse(responseMap, answerMap);
        const questionAnswerResponseMap = combineQuestionAnswerResponse(questionMap, answerResponseMap);

        const quiz = new Map();
        let tempArray = [];
        let roundTrack = 0;
        let questionTrack = 0;
        for (const [key, val] of questionAnswerResponseMap.entries()) {
            tempArray.push(val);
            questionTrack += 1;

            if ((questionTrack % state.noQuestions === 0) && (questionTrack !== 0)) {
                quiz.set(roundTrack, tempArray)
                tempArray = [];
                roundTrack += 1;
            }
        }
        console.log(quiz);
        console.log(JSON.stringify(quiz));

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
            <br/>
            <button onClick={handleSubmit}>Setup Quiz</button>

        </div>
    );
}

export default Questions;