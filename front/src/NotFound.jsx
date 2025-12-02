import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="not-found-container">
            <h1>Sorry, the page you were looking for was not found.</h1>
            <Link to="/" class="super-button">
            <span>Launch Now</span>
            <svg fill="none" viewBox="0 0 24 24" class="arrow">
                <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                stroke="currentColor"
                d="M5 12h14M13 6l6 6-6 6"
                ></path>
            </svg>
            </Link>
        </div>
    )
}
