import React, {useEffect, useState} from "react";
import "./account.css"
import {Button, Form, Tab, Input} from "semantic-ui-react";
import axios from 'axios';

const Quiz = () => {
    const state = {
        quizName: localStorage.getItem("name"),
        username: localStorage.getItem("username"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
    };

    const [quizData, setQuiz] = useState([]);
    const [userName, setUsername] = useState('');
    const [response, setResponse] = useState('');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        getQuiz();
    }, []);

    const getQuiz = () => {
        axios.post('http://localhost:9090/api/get-quiz', JSON.stringify(state.quizName)).then((response) => {
            if (response.status === 500) {
                alert("Couldn't retrieve the quiz");
            } else {
                return response.data;
            }
        }).then((jsonResponse) => {
            // Need to parse through the json data into a usable object
            setQuiz(handleRounds(jsonResponse.Quiz))
        }).catch((err) => {
            console.log(err);
        });
    }

    // Parses through json to format it into usable array
    const handleRounds = (quizJSON) => {
        let quizArray = [];
        let quiz = [];
        const quizTemp = [];

        // Get the quiz array from the object
        for (const quizObject of Object.values(quizJSON)) {
            quizTemp.push(Array.from(quizObject));
        }

        // Turn the double array into a singular one
        for (let i = 0; i < state.noQuestions; i++) {
            //console.log(quizTemp);
            quiz = quizTemp;
        }

        // First zero doesn't change
        for (let roundTrack = 0; roundTrack < state.noRounds; roundTrack++) {
            quizArray.push(handleQuestions(((quiz[0])[roundTrack])));
        }
        //console.log({quizArray});
        return quizArray;
    }

    // Parses through each question
    const handleQuestions = (quiz) => {
        const questions = new Map();
        let roundArray = [];

        for (const value of Object.values(quiz)) {
            roundArray = value;
        }

        for (let questionTrack = 0; questionTrack < state.noQuestions; questionTrack++) {
            let answerArray = [];
            for (const value1 of Object.values((roundArray[questionTrack])[0])) {
                //console.log({key1});
                // Always zero
                answerArray = value1[0];
            }

            for (const [key2, value2] of Object.entries(answerArray)) {
                questions.set(key2, value2);
            }
        }

        return questions;
    }

    const TabExampleBasic = () => <Tab panes={setupRounds()}/>

    const setupRounds = () => {
        const panes = [];
        let temp = [];
        let questions = [];

        if (quizData && quizData.length) {
            temp = quizData;

            for (const val of Object.values(temp)) {
                questions.push(val);
            }

            for (let j = 0; j < state.noRounds; j++) {
                panes.push(
                    {
                        menuItem: 'Round ' + j, render: () =>
                            <Tab.Pane>
                                {makeQuestions(questions[j], j)}
                            </Tab.Pane>
                    }
                );
            }
        }

        return panes;
    }

    const makeQuestions = (value, roundTrack) => {
        const questions = [];

        let i = 1;
        let questionTrack = 0;
        for (const [questionName, answerResponse] of value) {
            // Holds answers for current question
            const currentAnswers= []
            // Holds responses for current question
            const currentResponses = []

            // answerResponse hold answers and response in a single array
            for (let z = 0; z < 4; z++){
                let k = 0;
                for(const response of Object.values(answerResponse[z])) {
                    if (k % 2 === 0) {
                        currentAnswers.push(response);
                    } else {
                        currentResponses.push(response);
                    }
                    k += 1;
                }
            }

            questions.push(
                <Form>
                    <Form.Field
                        label={"Question " + i + ": "+questionName}
                        name={"Round" + roundTrack + "Question" + questionTrack}
                    />
                    <Form.Group widths={"equal"}>
                        <Button.Group>
                            {makeAnswers(currentAnswers, currentResponses, questionTrack, roundTrack)}
                        </Button.Group>
                    </Form.Group>
                </Form>
            );
            questions.map(question =>
                <li key={questionTrack}>{question}</li>);
            // answerTrack += 1;
            i += 1;
            questionTrack += 1;
        }

        return questions;
    }

    const onChangeValue = (event) => {
        setResponse({
            ...response,
            [event.target.id]: event.target.value
        });
    }

    const makeAnswers = (currentAnswer, currentResponse, i, j) => {
        // Returned for rendering
        const answers = [];

        for (let z = 0; z < 4; z++){
            answers.push(
                <Button
                    inverted color='teal'
                    id={"Round"+j+"Question"+i+"Response"}
                    value={currentResponse[z]}
                    onClick={(e) => {onChangeValue(e)}}
                >{""+currentAnswer[z]}</Button>
            );
            answers.map(answer =>
                <li key={z}>{answer}</li>);
        }
        return answers;
    }

    const handleSubmit = () => {
        let score = 0;
        console.log(response);
        for (const val of Object.values(response)) {
            if (val === "true") {
                score += 1;
            }
        }

        const submit = {
            "QuizName": state.username,
            "UserName": userName,
            "Score": score
        }

        axios.post('http://localhost:9090/api/add-participant', JSON.stringify(submit)).then((response) => {
            if (response.status !== 200) {
                alert("Couldn't submit results");
            } else {
                console.log(response)
            }
            //console.log(response)
        })

        setIsPending(true);
    }

    const quiz = () => {
        return (
            <div>
                {TabExampleBasic()}
                <br/>
                <Input type='text' placeholder='Username' action onChange={(event => {setUsername(event.target.value)})}>
                    <input />
                    <Button type='submit' onClick={(e => {handleSubmit()})}>Submit Questions</Button>
                </Input>
            </div>
        );
    }

    const leaderboard = () => {
        // axios.post('http://localhost:9090/api/get-participants', JSON.stringify(state.quizName)).then((response) => {
        //     if (response.status === 500) {
        //         alert("Couldn't retrieve the quiz");
        //     } else {
        //         return response.data;
        //     }
        // }).then((jsonResponse) => {
        //     // Need to parse through the json data into a usable object
        //
        // }).catch((err) => {
        //     console.log(err);
        // });

        return (
            <p>Testing</p>
        )
    }


    return (
        <div className={"create"}>
            <h2>Welcome to {state.quizName}</h2>
            <h2>Created by {state.username}</h2>
            {!isPending && quiz()}
            {isPending && leaderboard()}
        </div>
    )
}

export default Quiz;