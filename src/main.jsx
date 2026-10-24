
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
    const [trips, setTrips] = useState(() => {
    try {
        const savedTrips = localStorage.getItem("travelTrips");

        return savedTrips ? JSON.parse(savedTrips) : [];
    } catch (error) {
        return [];
    }
});
    useEffect(() => {
    localStorage.setItem("travelTrips", JSON.stringify(trips));
}, [trips]);

    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (endDate < startDate) {
            alert("End date must be after the start date.");
            return;
        }

        const newTrip = {
            id: Date.now(),
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            budget: Number(budget)
        };

        setTrips([...trips, newTrip]);

        setDestination("");
        setStartDate("");
        setEndDate("");
        setBudget("");
    }

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
                    <h1>My Dashboard</h1>
                    <p>Plan your next adventure.</p>
                </header>

                <section className="summary-cards">
                    <div className="summary-card">
                        <h3>Total Trips</h3>
                        <p className="number">{trips.length}</p>
                    </div>

                    <div className="summary-card">
                        <h3>Upcoming Trips</h3>
                        <p className="number">
                            {trips.filter(
                                (trip) => trip.startDate >=
                                    new Date().toISOString().split("T")[0]
                            ).length}
                        </p>
                    </div>

                    <div className="summary-card">
                        <h3>Completed Trips</h3>
                        <p className="number">
                            {trips.filter(
                                (trip) => trip.endDate <
                                    new Date().toISOString().split("T")[0]
                            ).length}
                        </p>
                    </div>
                </section>

                <section className="trips-section">
                    <h2>My Trips</h2>

                    {trips.length === 0 ? (
                        <div className="empty-state">
                            <h3>No trips planned yet</h3>
                            <p>Add a trip using the form below.</p>
                        </div>
                    ) : (
                        <div className="trip-list">
                            {trips.map((trip) => (
                                <div className="trip-card" key={trip.id}>
                                    <h3>{trip.destination}</h3>
                                    <p>
                                        <strong>Start:</strong> {trip.startDate}
                                    </p>
                                    <p>
                                        <strong>End:</strong> {trip.endDate}
                                    </p>
                                    <p>
                                        <strong>Budget:</strong> ₹
                                        {trip.budget.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="add-trip-section">
                    <h2>Plan a New Trip</h2>
                    <p>Enter your travel details below.</p>

                    <form className="trip-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="destination">Destination</label>
                            <input
                                id="destination"
                                type="text"
                                placeholder="e.g. Manali"
                                value={destination}
                                onChange={(event) =>
                                    setDestination(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDate">End Date</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
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
                                value={budget}
                                onChange={(event) =>
                                    setBudget(event.target.value)
                                }
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


