import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
    return (
        <div className="app">
            <h1>Travel Planner</h1>
            <p>Plan your next trip with ease.</p>

            <div className="welcome-card">
                <h2>Welcome!</h2>
                <p>Your travel planning journey starts here.</p>
            </div>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);
