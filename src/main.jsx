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

<section className="add-trip-section">
    <h2>Plan a New Trip</h2>
    <p>Enter your travel details below.</p>

    <form className="trip-form" onSubmit={(event) => {
        event.preventDefault();
    }}>
        <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
                id="destination"
                type="text"
                placeholder="e.g. Manali"
                required
            />
        </div>

        <div className="form-row">
            <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                    id="startDate"
                    type="date"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                    id="endDate"
                    type="date"
                    required
                />
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="budget">Budget (₹)</label>
            <input
                id="budget"
                type="number"
                placeholder="Enter your budget"
                min="1"
                required
            />
        </div>

        <button type="submit" className="add-trip-button">
            Add Trip
        </button>
    </form>
</section>

            </main>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);

