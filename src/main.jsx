
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
    const [activePage, setActivePage] = useState("Dashboard");

    const [trips, setTrips] = useState(() => {
        try {
            const savedTrips = localStorage.getItem("travelTrips");
            return savedTrips ? JSON.parse(savedTrips) : [];
        } catch (error) {
            return [];
        }
    });

    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(() => {
        localStorage.setItem("travelTrips", JSON.stringify(trips));
    }, [trips]);

    function handleSubmit(event) {
        event.preventDefault();

        if (endDate < startDate) {
            alert("End date must be after the start date.");
            return;
        }

        const newTrip = {
            id: Date.now(),
            destination: destination.trim(),
            startDate,
            endDate,
            budget: Number(budget)
        };

        setTrips([...trips, newTrip]);

        setDestination("");
        setStartDate("");
        setEndDate("");
        setBudget("");

        setActivePage("My Trips");
    }

    function handleDelete(tripId) {
        const updatedTrips = trips.filter(
            (trip) => trip.id !== tripId
        );

        setTrips(updatedTrips);
    }

    const today = new Date().toISOString().split("T")[0];

    const upcomingTrips = trips.filter(
        (trip) => trip.startDate >= today
    );

    const completedTrips = trips.filter(
        (trip) => trip.endDate < today
    );

    function renderTrips() {
        if (trips.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No trips planned yet</h3>
                    <p>Your planned trips will appear here.</p>
                </div>
            );
        }

        return (
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
                            <strong>Budget:</strong>{" "}
                            ₹{trip.budget.toLocaleString("en-IN")}
                        </p>

                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(trip.id)}
                        >
                            Delete Trip
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2 className="logo">Travel Planner</h2>

                <nav>
                    <button
                        type="button"
                        className={`nav-button ${
                            activePage === "Dashboard" ? "active" : ""
                        }`}
                        onClick={() => setActivePage("Dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className={`nav-button ${
                            activePage === "My Trips" ? "active" : ""
                        }`}
                        onClick={() => setActivePage("My Trips")}
                    >
                        My Trips
                    </button>

                    <button
                        type="button"
                        className={`nav-button ${
                            activePage === "Settings" ? "active" : ""
                        }`}
                        onClick={() => setActivePage("Settings")}
                    >
                        Settings
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                {activePage === "Dashboard" && (
                    <>
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
                                    {upcomingTrips.length}
                                </p>
                            </div>

                            <div className="summary-card">
                                <h3>Completed Trips</h3>
                                <p className="number">
                                    {completedTrips.length}
                                </p>
                            </div>
                        </section>

                        <section className="trips-section">
                            <h2>My Trips</h2>
                            {renderTrips()}
                        </section>

                        <section className="add-trip-section">
                            <h2>Plan a New Trip</h2>
                            <p>Enter your travel details below.</p>

                            <form
                                className="trip-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="form-group">
                                    <label htmlFor="destination">
                                        Destination
                                    </label>

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
                                        <label htmlFor="startDate">
                                            Start Date
                                        </label>

                                        <input
                                            id="startDate"
                                            type="date"
                                            min={today}
                                            value={startDate}
                                            onChange={(event) =>
                                                setStartDate(event.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="endDate">
                                            End Date
                                        </label>

                                        <input
                                            id="endDate"
                                            type="date"
                                            min={startDate || today}
                                            value={endDate}
                                            onChange={(event) =>
                                                setEndDate(event.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="budget">
                                        Budget (₹)
                                    </label>

                                    <input
                                        id="budget"
                                        type="number"
                                        min="1"
                                        placeholder="Enter your budget"
                                        value={budget}
                                        onChange={(event) =>
                                            setBudget(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="add-trip-button"
                                >
                                    Add Trip
                                </button>
                            </form>
                        </section>
                    </>
                )}

                {activePage === "My Trips" && (
                    <>
                        <header className="topbar">
                            <h1>My Trips</h1>
                            <p>View and manage your planned trips.</p>
                        </header>

                        {renderTrips()}

                        <button
                            type="button"
                            className="add-trip-button"
                            onClick={() => setActivePage("Dashboard")}
                        >
                            Plan a New Trip
                        </button>
                    </>
                )}

                {activePage === "Settings" && (
                    <>
                        <header className="topbar">
                            <h1>Settings</h1>
                            <p>About your Travel Planner application.</p>
                        </header>

                        <section className="add-trip-section">
                            <h2>Application Information</h2>
                            <p>
                                <strong>Application:</strong> Travel Planner
                            </p>
                            <p>
                                <strong>Platform:</strong> Desktop
                                application built with React and Electron
                            </p>
                            <p>
                                <strong>Saved Trips:</strong> {trips.length}
                            </p>
                            <p>
                                Your trips are stored locally on this
                                device using localStorage.
                            </p>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);