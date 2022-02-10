import React, {Component, lazy} from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import {Container, Header} from "semantic-ui-react";
import "../App.css";
import Image from 'react-bootstrap/Image'
import logo from '../img/logo.png'
import SignUp from "./SignUp";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom"
import App from "../App";

class PoolQuiz extends Component {
    render() {
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
            </div>
        )
    }
}

export default PoolQuiz