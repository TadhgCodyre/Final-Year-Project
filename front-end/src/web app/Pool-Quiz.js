import React, {Component, useState} from "react";
import Button from 'react-bootstrap/Button';
import {Container, Header, Input} from "semantic-ui-react";
import "../App.css";
import { Link } from "react-router-dom"
import App from "../App";

class PoolQuiz extends Component {
    render() {
        let pin = '';
        localStorage.clear()

        // Sends the pin to the Back-End
        function handleSubmit() {
            fetch('http://localhost:9090/api/check-pin', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: JSON.stringify(pin)
            }).then((response) => {
                if (!response.ok) {
                    alert("Couldn't find quiz with given PIN")
                } else {
                    localStorage.setItem("pin", pin)
                    window.location.replace("/quiz")
                }
            });
        }

        return(
            <div>
                <Header as="h2">
                    <div className="title">
                        Pool Quiz
                    </div>
                </Header>
                <Link to={"signIn"}>
                    <Button variant="primary" className="button">Sign In</Button><br/>
                </Link>
                <br/>
                <Link to={"signUp"}>
                    <Button variant="primary" className="button">Sign Up</Button>
                </Link>
                <br/>
                <br/>
                <Input type='text' placeholder='1234 etc' action onChange={(event => {
                    function setPIN(value) {
                        pin = value
                    }

                    setPIN(event.target.value)})}>
                    <input />
                    <Button type='submit' onClick={(handleSubmit)}>Enter PIN</Button>
                </Input>
            </div>
        )
    }
}

export default PoolQuiz