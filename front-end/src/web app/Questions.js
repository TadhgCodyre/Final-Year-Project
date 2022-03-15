import ReactJSX, {Component, useState} from "react";
import "./account.css"
import * as React from 'react';
import {Form, Tab} from "semantic-ui-react";

const Questions = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('');

    let answerArray = [];
    let questionArray = [];
    let responseArray = [];

    // Getting the user submitted information
    const state = {
        name: localStorage.getItem("name"),
        pin: localStorage.getItem("pin"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
    };

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
                        {/*<label>Response</label>*/}
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
                <Form.Button
                    //type={"radio"}#
                    inverted color='teal'
                    id={"Round"+j+"Question"+i+"AnswerResponse"+z}
                    name={"Round"+j+"Question"+i+"AnswerResponse"}
                    //checked={response1}
                    onClick={(e) => {onChangeValue(e)}}
                >{"Answer "+z}</Form.Button>
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
        return Array.from(responseMap.values());
    }

    // Parses answers object
    const setupAnswers = () => {
        const answerMap = new Map();
        let answers = [];

        let qTrack = 0;
        let roundTrack = 0;
        for (const val of Object.values(answer)) {
            answers.push(val);
            qTrack += 1;

            if ((qTrack % 4 === 0) && (qTrack !== 0)) {
                answerMap.set(roundTrack, answers);
                answers = [];
                roundTrack += 1;
            }
        }

        return Array.from(answerMap.values());
    }

    // Parses questions object
    const setupQuestions = () => {
        const questions = [];

        // Parse into respective rounds
        let questionTrack = 0;
        // Go through each value in question object
        for (const val of Object.values(question)) {
            questions.push(val);
            questionTrack += 1;
        }

        return questions;
    }

    // Combines answer and response maps into one
    const combineQuestionsAnswerResponse = () => {
        // Combine the answer and response maps into one
        const answerResponseJSON = [];

        for (let i = 0; i < (state.noRounds); i++) {
            answerResponseJSON.push(
                {
                    ["Round"+i]: handleJSON()
                }
            );
        }

        //console.log(Object.fromEntries(answerResponseMap));

        return answerResponseJSON;
    }

    const handleJSON = () => {
        const json = [];

        for (let j = 0; j < (state.noQuestions); j++) {
            let tempAnswer = answerArray.shift();
            let tempResponse = responseArray.shift();
            json.push(
                [{
                    ["Question"+j]: [{
                        [questionArray.shift()]: [
                            {
                                "Answer1": tempAnswer[0],
                                "Response1": tempResponse[0]
                            },
                            {
                                "Answer2": tempAnswer[1],
                                "Response2": tempResponse[1]
                            },
                            {
                                "Answer3": tempAnswer[2],
                                "Response3": tempResponse[2]
                            },
                            {
                                "Answer4": tempAnswer[3],
                                "Response4": tempResponse[3]
                            }
                        ]
                    }]
                }]
            );
        }

        return json
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(response)

        // Functions to get questions, answers and responses from their respective objects
        responseArray = setupResponses()
        answerArray = setupAnswers();
        questionArray = setupQuestions();

        const questionAnswerResponseJSON = combineQuestionsAnswerResponse();
        console.log(questionAnswerResponseJSON);

        const submit = {
            PIN: state.pin,
            Quiz: questionAnswerResponseJSON
        }

        fetch('http://localhost:9090/api/quiz-setup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submit),
        }).then(() => {
            console.log('new quiz added');
            //go to next page
            window.location.replace("/quiz");
        });
    };

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