const roomModel = require('../models/roomModel')

const path = require("path");
const {unlink} = require("fs");
const dailyRoomPrice = 500

const index = (req, res) => {
    roomModel.index()
        .then(rooms => {
            res.render("pages/rooms/index", { rooms });
        });
}

const show = (req, res) => {
    const id = req.params['id'];
    console.log("the id in controller is ", id);
    roomModel.show(id)
    
        .then(room => {
            console.log("here is the room :",room)
            res.render("pages/rooms/show", { room });
        });
}

const reservationFilter = async (req, res) => {
    const { start, end } = req.query;

    // No dates selected: display the search form.
    if (!start || !end) {
        return res.render("pages/reservations/index", {
            rooms: [],
            start: "",
            end: ""
        });
    }

    // Validate the date format and order.
    const validDate = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }

        const date = new Date(`${value}T00:00:00.000Z`);

        return !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value;
    };

    if (!validDate(start) || !validDate(end) || end <= start) {
        return res.status(400).send("Invalid reservation dates.");
    }

    try {
        const rooms = await roomModel.findAvailableRooms(start, end);

        return res.render("pages/reservations/index", {
            rooms,
            start,
            end
        });
    } catch (error) {
        console.error("Availability search failed:", error);

        return res.status(500).send("Unable to search available rooms.");
    }
};

const reservationCreate = async (req, res) => {
    const { roomId, start, end } = req.query;

    if (!roomId || !start || !end) {
        return res.status(400).send("Missing room or reservation dates.");
    }

    try {
        const rooms = await roomModel.index();

        const room = rooms.find(
            room => room._id.toString() === roomId
        );

        if (!room) {
            return res.status(404).send("Room not found.");
        }

        return res.render("pages/reservations/create", {
            room,
            start,
            end,
            dailyPrice: dailyRoomPrice
        });
    } catch (error) {
        console.error("Error loading reservation form:", error);
        return res.status(500).send("Could not load the reservation form.");
    }
};


const store = async (req, res) => {
    const { roomId, clientName, start, end } = req.body;
    const validDate = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
            return false;
        }

        const date = new Date(`${value}T00:00:00.000Z`);

        return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    };

    if (
        !roomId ||
        !clientName?.trim() ||
        !validDate(start) ||
        !validDate(end) ||
        end <= start
    ) {
        return res.status(400).send("Invalid reservation information.");
    }
const startDate = new Date(`${start}T00:00:00.000Z`);
const endDate = new Date(`${end}T00:00:00.000Z`);

const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

const totalPrice = numberOfDays * dailyRoomPrice;

    try {
        await roomModel.createReservation(roomId, {
            clientName: clientName.trim(),
            payment: Number(totalPrice),
            dailyPrice: dailyRoomPrice,
            start,
            end,
            status: "pending"
        });

        return res.redirect("/rooms");
    } catch (error) {
        if (error.message === "Room not found.") {
            return res.status(404).send(error.message);
        }

        if (error.message === "This room is not available for these dates.") {
            return res.status(409).send(error.message);
        }

        console.error("Error creating reservation:", error);
        return res.status(500).send("Could not create the reservation.");
    }
};


const updateReservationStatus = async (req, res) => {
    const { id, reservationIndex } = req.params;
    const { status } = req.body;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        return res.status(400).send("Invalid room ID.");
    }

    if (!/^\d+$/.test(reservationIndex)) {
        return res.status(400).send("Invalid reservation index.");
    }

    if (!["current", "done", "canceled"].includes(status)) {
        return res.status(400).send("Invalid reservation status.");
    }

    try {
        await roomModel.updateReservationStatus(
            id,
            reservationIndex,
            status
        );

        return res.redirect(`/rooms/${id}`);
    } catch (error) {
        if (
            error.message === "Room not found." ||
            error.message === "Reservation not found."
        ) {
            return res.status(404).send(error.message);
        }

        if (
            error.message === "This reservation cannot be updated."
        ) {
            return res.status(400).send(error.message);
        }

        console.error("Error updating reservation status:", error);

        return res.status(500).send(
            "Could not update reservation status."
        );
    }
};

module.exports = {
    index,
    show,
    reservationFilter,
    reservationCreate,
    store,
    updateReservationStatus,
}