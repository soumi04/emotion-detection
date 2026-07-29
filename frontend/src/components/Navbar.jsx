import { FaSmile } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">

                <FaSmile />

                <span>Emotion Detection AI</span>

            </div>

            <ul>

                <li>Home</li>

                <li>About</li>

            </ul>

        </nav>
    );
}

export default Navbar;