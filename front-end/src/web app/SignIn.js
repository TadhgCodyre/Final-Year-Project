import React, { useState } from "react";
import "./account.css"

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
        }).then((response) => {
            console.log(response.ok);
            if (!response.ok) {
                alert("Wrong password or email, try again")
            } else {
                console.log("logged in")
                localStorage.setItem("username", email.substring(0, email.indexOf("@")))
                window.location.replace("/quizSetup")
            }
        });
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
                    <button>Sign In</button>
                </form>
            </div>
    );
}

export default SignIn;