import '../App.css'
import Image from "react-bootstrap/Image";
import logo from "../img/logo.png";
import React from "react";
import { Link } from "react-router-dom"

// The image acts as the navbar, allowing the user to return to the home screen on click
const Navbar = () => {
    return (
        <nav className={"navbar"}>
            <div className={"links"}>
                <Link to={"/"}><Image src={logo} className="logo"/><br/></Link>
            </div>
        </nav>
    )
}

export default Navbar