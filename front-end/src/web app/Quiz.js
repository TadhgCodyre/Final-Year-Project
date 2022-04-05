import React, {useEffect, useState} from "react";
import "./account.css"
import {Button, Form, Tab, Input, Segment, Loader, Image, Dimmer} from "semantic-ui-react";
import axios from 'axios';
import Countdown from "react-countdown";

const Quiz = () => {
    const state = {
        quizName: localStorage.getItem("name"),
        userName: localStorage.getItem("username"),
        pin: localStorage.getItem("pin"),
    };

    const [quizData, setQuiz] = useState([]);
    const [noRounds, setNoRounds] = useState('');
    const [noQuestions, setNoQuestions] = useState('');
    const [quizName, setQuizName] = useState('');
    const [pin, setPIN] = useState('');
    const [quick, setQuick] = useState('');

    const [partName, setPartName] = useState('');
    const [response, setResponse] = useState('');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        getQuiz().then(res => {
            setQuiz(handleRounds(res.Quiz));
            setNoRounds(res.NumberRounds);
            setNoQuestions(res.NumberQuestions);
            setQuizName(res.QuizName);
            setPIN(res.PIN);
            setQuick(res.QuickResponses);
            setIsPending(true);
        });
        // Will only run once noQuestions is changed
    }, [noQuestions]);

    // Gets the quiz with the corresponding PIN
    const getQuiz = async () => {
        return await axios.post('http://localhost:9090/api/get-quiz', JSON.stringify(state.pin)).then((response) => {
            if (response.status === 500) {
                alert("Couldn't retrieve the quiz");
            } else {
                return response.data;
            }
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
        for (let i = 0; i < noQuestions; i++) {
            quiz = quizTemp;
        }

        // First zero doesn't change
        for (let roundTrack = 0; roundTrack < noRounds; roundTrack++) {
            quizArray.push(handleQuestions(((quiz[0])[roundTrack])));
        }
        return quizArray;
    }

    // Parses through each question
    const handleQuestions = (quiz) => {
        const questions = new Map();
        let roundArray = [];

        // Gets each round from the quiz
        for (const value of Object.values(quiz)) {
            roundArray = value;
        }

        // Goes through round to get each question
        for (let questionTrack = 0; questionTrack < noQuestions; questionTrack++) {
            let answerArray = [];
            for (const value1 of Object.values((roundArray[questionTrack])[0])) {
                // Will always be the first value in the array
                answerArray = value1[0];
            }

            // Adds all answers and responses for the question to the questions map
            for (const [key2, value2] of Object.entries(answerArray)) {
                questions.set(key2, value2);
            }
        }

        return questions;
    }

    // Makes the necessary tabs for each round
    const makeTabs = () => <Tab panes={setupRounds()}/>

    // Creates the tab for each round of the quiz
    const setupRounds = () => {
        const panes = [];
        let questions = [];
        // Will only run if quizData is initialised and greater than length 0
        if (quizData && quizData.length) {
            console.log({quizData});
            // Gets each round from quizData
            for (const round of Object.values(quizData)) {
                questions.push(round);
            }

            for (let j = 0; j < noRounds; j++) {
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

    // Makes the correct number of questions to fill out
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

    // Each question has 4 possible answers. They created here
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

    // Get the name from the user if they run out of time
    const countDown = () => {
        let name = prompt("Ran out of time! Please enter your name: ");
        handleSubmit(name);
    }

    // Grades the users score and sends it to the Back-End
    const handleSubmit = async (name) => {
        let score = 0;
        for (const val of Object.values(response)) {
            if (val === "true") {
                score += 1;
            }
        }

        const submit = {
            "PIN": pin,
            "UserName": name,
            "Score": score
        }

        await axios.post('http://localhost:9090/api/add-participant', JSON.stringify(submit)).then((response) => {
            if (response.status !== 200) {
                alert("Couldn't submit results");
            } else {
                console.log(response)
            }

            window.location.replace("/leaderboard");
        })

        setIsPending(true);
    }

    const quiz = () => {
        return (
            <div className={"bill"}>
                <br/>
                <Input type='text' placeholder='Username' action onChange={(event => {setPartName(event.target.value)})}>
                    <input />
                    <Button type='submit' onClick={(event) => handleSubmit(partName)}>Submit Questions</Button>
                </Input>
            </div>
        );
    }

    // Display a loading component until quiz is ready
    const Loading = () => (
        <div>
            <Segment>
                <Dimmer active colou>
                    <Loader>Loading</Loader>
                </Dimmer>
                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
            </Segment>
        </div>
    )

    if(!isPending){
        return(
            <div className={"create"}>
                {Loading()}
            </div>
        )
    }
    else{
        return (
            <div className={"create"}>
                <h2>Welcome to {quizName}</h2>
                <Countdown date={Date.now() + quick} onComplete={countDown} />
                <h3>PIN: {pin}</h3>
                {makeTabs()}
                {quiz()}
            </div>
        )
    }
}

export default Quiz;