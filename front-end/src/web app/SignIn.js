import React, { useState } from "react";
import "./account.css"
import {Link} from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const account = { email, password};

        fetch('http://localhost:9090/api/sign-in', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(account)
        }).then(() => {
            console.log('logged in');
        })
    }

    return (
            <div className="create">
                <h2>Login</h2>
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
                    <Link to={"quizSetup"}>
                        <button>Sign In</button>
                    </Link>
                </form>
            </div>
    );
}

export default SignIn;