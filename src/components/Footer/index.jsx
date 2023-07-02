import React from "react"
import Logo from "../../asset/images/logo.png";
import "./style.scss";

const Footer = () => {
    return (
        <footer>
            <img src={Logo} alt="" />
            <span>Made with ❤️ and <b>React.js</b></span>
        </footer>
    )
}

export default Footer