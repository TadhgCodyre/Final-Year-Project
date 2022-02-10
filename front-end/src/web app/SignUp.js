import React, { useState } from "react";
import "./account.css"
import {Link} from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { email, password};
        console.log(blog)

        fetch('http://localhost:9090/api/sign-up', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then(() => {
            console.log('new blog added');
            //go to next page
            window.location.replace("/quizSetup")
        })
    }

    return (
        <div className="create">
            <h2>Create a new account</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/*<Link to={"quizSetup"}>*/}
                    <button>
                            Sign Up
                    </button>
                {/*</Link>*/}
                </form>
            </div>
    );
}

export default SignUp;