import React, {useEffect, useState} from "react";
import "./account.css"
import {Header, Image, Table} from "semantic-ui-react";
import axios from 'axios';

const Leaderboard = () => {
    const state = {
        quizName: localStorage.getItem("name"),
    };

    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        getParticipants();
    }, []);

    const getParticipants = async () => {
        await axios.post('http://localhost:9090/api/get-quiz', JSON.stringify(state.quizName)).then((response) => {
            if (response.status === 500) {
                alert("Couldn't retrieve the quiz");
            } else {
                return response.data;
            }
        }).then((jsonResponse) => {
            // Need to parse through the json data into a usable object
            setParticipants(jsonResponse.Participants);
            console.log("test")
        }).catch((err) => {
            console.log(err);
        });
    }

    const makeTableBody = () => {
        const tableArray = [];
        const participantsMap = new Map();

        if (participants && participants.length) {
            // Sort json data into usable map
            for (const participant of Object.values(participants)) {
                participantsMap.set(participant[0].Key, participant[0].Value)
            }

            participantsMap[Symbol.iterator] = function* () {
                yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
            }

            let i = 0;
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


        console.log(participantsMap);

        return tableArray;
    }

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
            <h2>Quiz: {state.quizName}</h2>
            {makeLeaderboard()}
        </div>
    )
}

export default Leaderboard;