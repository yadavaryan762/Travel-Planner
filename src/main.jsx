
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const stationList = [
    "Pune Junction",
    "Mumbai Central",
    "New Delhi",
    "Chennai Central"
];

// Sample facility information for demonstration purposes
const stationFacilities = {
    "Pune Junction": [
        "Platforms",
        "Waiting Room",
        "Ticket Counter",
        "Food Outlets",
        "Toilets"
    ],
    "Mumbai Central": [
        "Platforms",
        "Waiting Room",
        "Ticket Counter",
        "Food Outlets",
        "Toilets"
    ],
    "New Delhi": [
        "Platforms",
        "Waiting Room",
        "Ticket Counter",
        "Food Outlets",
        "Toilets"
    ],
    "Chennai Central": [
        "Platforms",
        "Waiting Room",
        "Ticket Counter",
        "Food Outlets",
        "Toilets"
    ]
};

function App() {
    const [activePage, setActivePage] = useState("Dashboard");

    const [trips, setTrips] = useState(() => {
        try {
            const savedTrips = localStorage.getItem("railwayJourneys");
            return savedTrips ? JSON.parse(savedTrips) : [];
        } catch (error) {
            return [];
        }
    });

    const [sourceStation, setSourceStation] = useState("");
    const [destinationStation, setDestinationStation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [notes, setNotes] = useState("");
    const [editingTripId, setEditingTripId] = useState(null);
    const [selectedStation, setSelectedStation] = useState("Pune Junction");
    const [stationSearch, setStationSearch] = useState("");

    useEffect(() => {
        localStorage.setItem("railwayJourneys", JSON.stringify(trips));
    }, [trips]);

    const today = new Date().toLocaleDateString("en-CA");

    const upcomingTrips = trips.filter(
        (trip) => trip.startDate >= today
    );

    const completedTrips = trips.filter(
        (trip) => trip.endDate < today
    );

    function clearForm() {
        setSourceStation("");
        setDestinationStation("");
        setStartDate("");
        setEndDate("");
        setBudget("");
        setNotes("");
        setEditingTripId(null);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const cleanSource = sourceStation.trim();
        const cleanDestination = destinationStation.trim();
        const tripBudget = Number(budget);

        if (!cleanSource || !cleanDestination) {
            alert("Please enter both station names.");
            return;
        }

        if (cleanSource.toLowerCase() === cleanDestination.toLowerCase()) {
            alert("Source and destination stations must be different.");
            return;
        }

        if (startDate < today && editingTripId === null) {
            alert("Please select today or a future journey date.");
            return;
        }

        if (endDate < startDate) {
            alert("Return date must be on or after the journey date.");
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
                        sourceStation: cleanSource,
                        destination: cleanDestination,
                        startDate,
                        endDate,
                        budget: tripBudget,
                        notes: notes.trim()
                    };
                }

                return trip;
            });

            setTrips(updatedTrips);
            alert("Journey updated successfully!");
        } else {
            const newTrip = {
                id: Date.now(),
                sourceStation: cleanSource,
                destination: cleanDestination,
                startDate,
                endDate,
                budget: tripBudget,
                notes: notes.trim()
            };

            setTrips((previousTrips) => [...previousTrips, newTrip]);
            alert("Journey added successfully!");
        }

        clearForm();
        setActivePage("My Journeys");
    }

    function handleEdit(trip) {
        setSourceStation(trip.sourceStation || "");
        setDestinationStation(trip.destination || "");
        setStartDate(trip.startDate || "");
        setEndDate(trip.endDate || "");
        setBudget(String(trip.budget || ""));
        setNotes(trip.notes || "");
        setEditingTripId(trip.id);
        setActivePage("Dashboard");
    }

    function handleDelete(tripId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this journey?"
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

    function renderTrips() {
        if (trips.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No journeys planned yet</h3>
                    <p>Add your first railway journey to get started.</p>
                </div>
            );
        }

        return (
            <div className="trip-list">
                {trips.map((trip) => (
                    <div className="trip-card" key={trip.id}>
                        <h3>
                            {trip.sourceStation || "Station not specified"}
                            {" → "}
                            {trip.destination}
                        </h3>

                        <p>
                            <strong>Journey Date:</strong> {trip.startDate}
                        </p>

                        <p>
                            <strong>Return Date:</strong> {trip.endDate}
                        </p>

                        <p>
                            <strong>Budget:</strong>{" "}
                            ₹{Number(trip.budget).toLocaleString("en-IN")}
                        </p>

                        {trip.notes && (
                            <p>
                                <strong>Notes:</strong> {trip.notes}
                            </p>
                        )}

                        <div className="trip-actions">
                            <button
                                type="button"
                                className="edit-button"
                                onClick={() => handleEdit(trip)}
                            >
                                Edit Journey
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => handleDelete(trip.id)}
                            >
                                Delete Journey
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const filteredStations = stationList.filter((station) =>
        station.toLowerCase().includes(stationSearch.toLowerCase())
    );

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2 className="logo">Railway Planner</h2>

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
                            activePage === "My Journeys" ? "active" : ""
                        }`}
                        onClick={() => setActivePage("My Journeys")}
                    >
                        My Journeys
                    </button>

                    <button
                        type="button"
                        className={`nav-button ${
                            activePage === "Station Facilities" ? "active" : ""
                        }`}
                        onClick={() => setActivePage("Station Facilities")}
                    >
                        Station Facilities
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
                            <h1>Railway Journey Dashboard</h1>
                            <p>Plan your journey and explore station facilities.</p>
                        </header>

                        <section className="summary-cards">
                            <div className="summary-card">
                                <h3>Total Journeys</h3>
                                <p className="number">{trips.length}</p>
                            </div>

                            <div className="summary-card">
                                <h3>Upcoming Journeys</h3>
                                <p className="number">{upcomingTrips.length}</p>
                            </div>

                            <div className="summary-card">
                                <h3>Completed Journeys</h3>
                                <p className="number">{completedTrips.length}</p>
                            </div>
                        </section>

                        <section className="add-trip-section">
                            <h2>
                                {editingTripId !== null
                                    ? "Edit Journey"
                                    : "Plan a Railway Journey"}
                            </h2>

                            <p>Enter your journey details below.</p>

                            <form className="trip-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="sourceStation">
                                            Source Station
                                        </label>
                                        <input
                                            id="sourceStation"
                                            type="text"
                                            placeholder="e.g. Pune Junction"
                                            value={sourceStation}
                                            onChange={(event) =>
                                                setSourceStation(event.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="destinationStation">
                                            Destination Station
                                        </label>
                                        <input
                                            id="destinationStation"
                                            type="text"
                                            placeholder="e.g. Mumbai Central"
                                            value={destinationStation}
                                            onChange={(event) =>
                                                setDestinationStation(event.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="startDate">
                                            Journey Date
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
                                            Return Date
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
                                    <label htmlFor="budget">Estimated Budget (₹)</label>
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

                                <div className="form-group">
                                    <label htmlFor="notes">Journey Notes (Optional)</label>
                                    <input
                                        id="notes"
                                        type="text"
                                        placeholder="e.g. Train details or reminders"
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                    />
                                </div>

                                <button type="submit" className="add-trip-button">
                                    {editingTripId !== null
                                        ? "Update Journey"
                                        : "Add Journey"}
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
                            <h2>Recent Journeys</h2>
                            {renderTrips()}
                        </section>
                    </>
                )}

                {activePage === "My Journeys" && (
                    <>
                        <header className="topbar">
                            <h1>My Journeys</h1>
                            <p>View, edit, or delete your saved railway journeys.</p>
                        </header>

                        {renderTrips()}

                        <button
                            type="button"
                            className="add-trip-button new-journey-button"
                            onClick={() => {
                                clearForm();
                                setActivePage("Dashboard");
                            }}
                        >
                            Plan a New Journey
                        </button>
                    </>
                )}

                {activePage === "Station Facilities" && (
                    <>
                        <header className="topbar">
                            <h1>Station Facilities</h1>
                            <p>Search a station to view its sample facility information.</p>
                        </header>

                        <section className="add-trip-section">
                            <div className="form-group">
                                <label htmlFor="stationSearch">Search Stations</label>
                                <input
                                    id="stationSearch"
                                    type="text"
                                    placeholder="Type a station name..."
                                    value={stationSearch}
                                    onChange={(event) =>
                                        setStationSearch(event.target.value)
                                    }
                                />
                            </div>

                            <div className="station-list">
                                {filteredStations.length === 0 ? (
                                    <p>No matching stations found.</p>
                                ) : (
                                    filteredStations.map((station) => (
                                        <button
                                            type="button"
                                            key={station}
                                            className={`station-button ${
                                                selectedStation === station
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => setSelectedStation(station)}
                                        >
                                            {station}
                                        </button>
                                    ))
                                )}
                            </div>

                            {stationList.includes(selectedStation) && (
                                <div className="facility-panel">
                                    <h2>{selectedStation}</h2>
                                    <p className="sample-note">
                                        Demonstration data — verify facilities
                                        with official station information.
                                    </p>

                                    <div className="facility-list">
                                        {stationFacilities[selectedStation].map(
                                            (facility) => (
                                                <div
                                                    className="facility-item"
                                                    key={facility}
                                                >
                                                    {facility}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {activePage === "Settings" && (
                    <>
                        <header className="topbar">
                            <h1>Settings</h1>
                            <p>Application information and saved data.</p>
                        </header>

                        <section className="add-trip-section">
                            <h2>About This Application</h2>
                            <p>
                                <strong>Application:</strong> Railway Journey Planner
                            </p>
                            <p>
                                <strong>Platform:</strong> Desktop application built
                                with React and Electron
                            </p>
                            <p>
                                <strong>Total Saved Journeys:</strong> {trips.length}
                            </p>
                            <p>
                                Journey information is saved locally in this
                                application's browser storage.
                            </p>
                            <p>
                                Station facilities shown in this version are sample
                                information and are not live railway data.
                            </p>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);
