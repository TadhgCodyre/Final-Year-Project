import React, { useState } from "react";
import "./account.css"

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { email, password};

        fetch('http://localhost:9090/api/sign-up', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then((response) => {
            if (!response.ok) {
                alert("Email already in use, try another")
            } else {
                console.log('new blog added');
                localStorage.setItem("username", email.substring(0, email.indexOf("@")))
                window.location.replace("/quizSetup")
            }

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
                <button>
                    Sign Up
                </button>
                </form>
            </div>
    );
}

export default SignUp;