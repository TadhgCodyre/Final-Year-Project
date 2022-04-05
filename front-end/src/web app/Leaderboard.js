import React, {useEffect, useState} from "react";
import "./account.css"
import {Header, Image, Table} from "semantic-ui-react";
import axios from 'axios';

const Leaderboard = () => {
    const state = {
        pin: localStorage.getItem("pin"),
    };

    const [quizName, setQuizName] = useState('')
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        getParticipants();
    }, []);

    // Gets all the completed participants and their scores for the quiz
    const getParticipants = async () => {
        await axios.post('http://localhost:9090/api/get-quiz', JSON.stringify(state.pin)).then((response) => {
            if (response.status === 500) {
                alert("Couldn't retrieve the quiz");
            } else {
                return response.data;
            }
        }).then((jsonResponse) => {
            // Need to parse through the json data into a usable object
            setParticipants(jsonResponse.Participants);
            setQuizName(jsonResponse.QuizName);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Makes the table to hold all the users and scores
    const makeTableBody = () => {
        const tableArray = [];
        const participantsMap = new Map();

        // Will only run once participants is initialised and greater than 0
        if (participants && participants.length) {
            // Sort json data into usable map
            for (const participant of Object.values(participants)) {
                participantsMap.set(participant[0].Key, participant[0].Value)
            }

            // Sorts the map into descending order
            participantsMap[Symbol.iterator] = function* () {
                yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
            }

            let i = 0;
            // For loop to create table to hold all users
            for (const [user, score] of participantsMap) {
                tableArray.push(
                    <Table.Row>
                        <Table.Cell>
                            {user}
                        </Table.Cell>
                        <Table.Cell>
                            {score}
                        </Table.Cell>
                    </Table.Row>
                );

                tableArray.map(question =>
                    <li key={i}>{question}</li>);

                i += 1;
            }
        }

        return tableArray;
    }

    // Makes the leaderboard
    const makeLeaderboard = () => {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Score</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {makeTableBody()}
                </Table.Body>
            </Table>
        )
    }

    return (
        <div className={"create"}>
            <h2>Leaderboard</h2>
            <h2>Quiz: {quizName}</h2>
            <h3>PIN: {state.pin}</h3>
            {makeLeaderboard()}
        </div>
    )
}

export default Leaderboard;