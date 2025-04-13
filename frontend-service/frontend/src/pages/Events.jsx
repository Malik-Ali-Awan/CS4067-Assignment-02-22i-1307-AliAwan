import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState("");
    const [tickets, setTickets] = useState(1);
    const [bookedEvents, setBookedEvents] = useState([]);
    const userId = localStorage.getItem("user_id"); // Retrieve logged-in user ID

    useEffect(() => {
        axios.get("http://localhost:30002/events")
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, []);

    const bookEvent = async () => {
        if (!eventId) {
            alert("Please enter an Event ID");
            return;
        }
        if (!userId) {
            alert("User not logged in");
            return;
        }
        try {
            const response = await axios.post("http://localhost:30003/bookings", {
                user_id: userId, // Use actual user ID
                event_id: eventId,
                tickets: tickets,
            });
            alert("Event booked successfully!");
        } catch (error) {
            console.error("Error booking event:", error);
            alert("Failed to book event");
        }
    };

    const fetchBookedEvents = async () => {
        if (!userId) {
            alert("User not logged in");
            return;
        }
        try {
          const response = await axios.get(`http://localhost:30003/bookings/${userId}`);
          setBookedEvents(response.data);
          console.log(response.data);
        } catch (error) {
            console.error("Error fetching booked events:", error);
        }
    };

    return (
        <div>
            <h1>Available Events</h1>
            <ul>
                {events.map(event => (
                    <li key={event.event_id}>
                        {event.name} - ID: {event.event_id}
                    </li>
                ))}
            </ul>
            <div>
                <h2>Book an Event</h2>
                <input 
                    type="text" 
                    placeholder="Enter Event ID" 
                    value={eventId} 
                    onChange={e => setEventId(e.target.value)}
                />
                <input 
                    type="number" 
                    placeholder="Tickets" 
                    value={tickets} 
                    onChange={e => setTickets(e.target.value)}
                    min="1"
                />
                <button onClick={bookEvent}>Book Event</button>
            </div>
            <div>
                <h2>Booked Events</h2>
                <button onClick={fetchBookedEvents}>View Booked Events</button>
                <ul>
                    {bookedEvents.map(event => (
                        <li key={event.event_id}>{event.event_name} - Tickets: {event.tickets}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Events;
