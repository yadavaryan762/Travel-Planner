
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
    const [activePage, setActivePage] = useState("Dashboard");

    // Load saved trips when the application starts
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
    const [editingTripId, setEditingTripId] = useState(null);

    // Save trips whenever the list changes
    useEffect(() => {
        localStorage.setItem("travelTrips", JSON.stringify(trips));
    }, [trips]);

    const today = new Date().toISOString().split("T")[0];

    const upcomingTrips = trips.filter(
        (trip) => trip.startDate >= today
    );

    const completedTrips = trips.filter(
        (trip) => trip.endDate < today
    );

    // Clear the form
    function clearForm() {
        setDestination("");
        setStartDate("");
        setEndDate("");
        setBudget("");
        setEditingTripId(null);
    }

    // Add a new trip or update an existing trip
    function handleSubmit(event) {
        event.preventDefault();

        const cleanDestination = destination.trim();
        const tripBudget = Number(budget);

        if (!cleanDestination) {
            alert("Please enter a destination.");
            return;
        }

        if (startDate < today && editingTripId === null) {
            alert("Please select today or a future date.");
            return;
        }

        if (endDate < startDate) {
            alert("End date must be on or after the start date.");
            return;
        }

        if (!Number.isFinite(tripBudget) || tripBudget <= 0) {
            alert("Please enter a valid budget.");
            return;
        }

        if (editingTripId !== null) {
            const updatedTrips = trips.map((trip) => {
                if (trip.id === editingTripId) {
                    return {
                        ...trip,
                        destination: cleanDestination,
                        startDate,
                        endDate,
                        budget: tripBudget
                    };
                }

                return trip;
            });

            setTrips(updatedTrips);
            alert("Trip updated successfully!");
        } else {
            const newTrip = {
                id: Date.now(),
                destination: cleanDestination,
                startDate,
                endDate,
                budget: tripBudget
            };

            setTrips((previousTrips) => [...previousTrips, newTrip]);
            alert("Trip added successfully!");
        }

        clearForm();
        setActivePage("My Trips");
    }

    // Load a trip into the form for editing
    function handleEdit(trip) {
        setDestination(trip.destination);
        setStartDate(trip.startDate);
        setEndDate(trip.endDate);
        setBudget(String(trip.budget));
        setEditingTripId(trip.id);
        setActivePage("Dashboard");
    }

    // Delete a trip
    function handleDelete(tripId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) {
            return;
        }

        setTrips((previousTrips) =>
            previousTrips.filter((trip) => trip.id !== tripId)
        );

        if (editingTripId === tripId) {
            clearForm();
        }
    }

    // Display all trips
    function renderTrips() {
        if (trips.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No trips planned yet</h3>
                    <p>Add your first trip to get started!</p>
                </div>
            );
        }

        return (
            <div className="trip-list">
                {trips.map((trip) => (
                    <div className="trip-card" key={trip.id}>
                        <h3>{trip.destination}</h3>

                        <p>
                            <strong>Start Date:</strong> {trip.startDate}
                        </p>

                        <p>
                            <strong>End Date:</strong> {trip.endDate}
                        </p>

                        <p>
                            <strong>Budget:</strong>{" "}
                            ₹{Number(trip.budget).toLocaleString("en-IN")}
                        </p>

                        <div className="trip-actions">
                            <button
                                type="button"
                                className="edit-button"
                                onClick={() => handleEdit(trip)}
                            >
                                Edit Trip
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => handleDelete(trip.id)}
                            >
                                Delete Trip
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
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

            {/* Main Content */}
            <main className="main-content">
                {/* Dashboard Page */}
                {activePage === "Dashboard" && (
                    <>
                        <header className="topbar">
                            <h1>My Dashboard</h1>
                            <p>Plan your next adventure!</p>
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

                        <section className="add-trip-section">
                            <h2>
                                {editingTripId !== null
                                    ? "Edit Trip"
                                    : "Plan a New Trip"}
                            </h2>

                            <p>
                                Enter your travel details below.
                            </p>

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
                                            min={
                                                editingTripId !== null
                                                    ? undefined
                                                    : today
                                            }
                                            value={startDate}
                                            onChange={(event) => {
                                                setStartDate(event.target.value);

                                                if (
                                                    endDate &&
                                                    event.target.value > endDate
                                                ) {
                                                    setEndDate("");
                                                }
                                            }}
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
                                    {editingTripId !== null
                                        ? "Update Trip"
                                        : "Add Trip"}
                                </button>

                                {editingTripId !== null && (
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={clearForm}
                                    >
                                        Cancel Editing
                                    </button>
                                )}
                            </form>
                        </section>

                        <section className="trips-section">
                            <h2>Recent Trips</h2>
                            {renderTrips()}
                        </section>
                    </>
                )}

                {/* My Trips Page */}
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
                            onClick={() => {
                                clearForm();
                                setActivePage("Dashboard");
                            }}
                        >
                            Plan a New Trip
                        </button>
                    </>
                )}

                {/* Settings Page */}
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
                                <strong>Platform:</strong> Desktop application
                                built with React and Electron
                            </p>

                            <p>
                                <strong>Total Saved Trips:</strong>{" "}
                                {trips.length}
                            </p>

                            <p>
                                Your trips are saved locally on this device.
                            </p>

                            <p>
                                You can add, edit, and delete trips from the
                                application.
                            </p>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);