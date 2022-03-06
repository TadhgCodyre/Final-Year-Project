import React, {useEffect, useState} from "react";
import "./account.css"
import Button from "react-bootstrap/Button";
import {Form, Tab} from "semantic-ui-react";
import axios from 'axios';
import usePromise from "react-promise";

const Quiz = () => {
    //const [quizGlobal, setQuiz] = useState([]);
    //let quizGlobal = [];
    const state = {
        quizName: localStorage.getItem("name"),
        username: localStorage.getItem("username"),
        noRounds: parseInt(localStorage.getItem("noRounds")),
        noQuestions: parseInt(localStorage.getItem("noQuestions")),
    };

    //const [isPending, setIsPending] = useState(false);
    const [quizData, setQuiz] = useState([]);
    //let quizGlobal = [];

    useEffect(() => {
        getQuiz();
    }, []);

    //const [render, setRender] = useState(false);
    //let quizArray = [];
    const getQuiz = () => {
        axios.post('http://localhost:9090/api/get-quiz', JSON.stringify(state.quizName)).then((response) => {
            if (response.status === 500) {
                alert("Couldn't retrieve the quiz");
            } else {
                return response.data;
            }
        }).then((jsonResponse) => {
            // Need to parse through the json data into a usable object
            //console.log(jsonResponse);
            setQuiz(handleRounds(jsonResponse.Quiz))
            //setQuiz({data: handleRounds(jsonResponse.Quiz)});
            // quizArray = handleRounds(jsonResponse.Quiz);
            //setIsPending(true);
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
        let temp = []

        if (quizData && quizData.length) {
            temp = quizData;

            let j = 1
            for (const val of Object.values(temp)) {
                panes.push(
                    {
                        menuItem: 'Round ' + j, render: () =>
                            <Tab.Pane>
                                {makeQuestions(val, j)}
                            </Tab.Pane>
                    }
                );
                j += 1;
            }
        }

        return panes;
    }

    const makeQuestions = (value, j) => {
        //console.log("test")
        //console.log({question});
        const questions = [];
        //console.log({value})

        // let j = 0;
        // let i = 0;
        //console.log(question);
        //questions.push(question)
        let i = 1;
        for (const [questionName, answerResponse] of value) {
            questions.push(
                <Form>
                    <Form.Field
                        label={"Question " + i + ": "+questionName}
                        name={"Round" + j + "Question" + i}
                    />
                    <Form.Group widths={"equal"}>
                         {makeAnswers(answerResponse, i, j)}
                    </Form.Group>
                    <Form.Group>
                        {/* <label>Response</label> */}
                        {/* {makeRadios(i, j)} */}
                    </Form.Group>
                </Form>
            );
            questions.map(question =>
                <li key={j}>{question}</li>);

            i += 1;
        }

        return questions;
    }

    // const makeRadios = (i, j) => {
    //     const radioArray = [];

    //     for (let z = 1; z < 5; z++) {
    //         radioArray.push(
    //             <Form.Radio
    //                 label={'Answer '+z}
    //                 type={"radio"}
    //                 id={"Round"+j+"Question"+i+"AnswerResponse"+z}
    //                 name={"Round"+j+"Question"+i+"AnswerResponse"}
    //                 //checked={response1}
    //                 onChange={(e) => {onChangeValue(e)}}
    //             />
    //         );
    //         radioArray.map(response =>
    //             <li key={z}>{response}</li>);
    //     }
    //     return radioArray;
    // }

    const makeAnswers = (answerResponse, i, j) => {
        const answers = [];
        for(const [answer, response] of Object.entries(answerResponse[0])) {
            console.log({answer});
            console.log({response});
        }

        for (let z = 1; z < 5; z++){
            answers.push(
                <Form.Button
                    fluid label={'Answer '+z}
                    name={"Round"+j+"Question"+i+"Answer"+z}
                />
            );
            answers.map(answer =>
                <li key={z}>{answer}</li>);
        }

        return answers;
    }


    return (
        <div className={"create"}>
            <h2>Welcome to {state.quizName}</h2>
            <h2>Created by {state.username}</h2>
            {/*{!render ? <Button onClick={() => getQuiz().then(data => {*/}
            {/*    quizGlobal = data})}>Start Quiz</Button> : setTimeout(TabExampleBasic(), 0)}*/}
            {/*{!isPending && <Button onClick={getQuiz}>Start Quiz</Button>}*/}
            {/*{isPending && TabExampleBasic()}*/}
            {/*{TabExampleBasic()}*/}
            {TabExampleBasic()}
        </div>
    )
}

export default Quiz;