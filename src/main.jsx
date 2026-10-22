import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2 className="logo">Travel Planner</h2>

                <nav>
                    <p className="active">Dashboard</p>
                    <p>My Trips</p>
                    <p>Settings</p>
                </nav>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h1>My Dashboard</h1>
                        <p>Plan your next adventure.</p>
                    </div>
                </header>

                <section className="summary-cards">
                    <div className="summary-card">
                        <h3>Total Trips</h3>
                        <p className="number">0</p>
                    </div>

                    <div className="summary-card">
                        <h3>Upcoming Trips</h3>
                        <p className="number">0</p>
                    </div>

                    <div className="summary-card">
                        <h3>Completed Trips</h3>
                        <p className="number">0</p>
                    </div>
                </section>

                <section className="trips-section">
                    <h2>My Trips</h2>

                    <div className="empty-state">
                        <h3>No trips planned yet</h3>
                        <p>Your planned trips will appear here.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);

