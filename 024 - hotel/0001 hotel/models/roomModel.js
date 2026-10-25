const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const rooms = await db.collection("rooms").find().toArray();
    client.close();
    return rooms;
}
async function show(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const rooms = await db.collection("rooms").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    console.log(rooms);
    return rooms
}

async function findAvailableRooms(start, end) {
    const client = await MongoClient.connect(mongoConnection);
    try {
        const db = client.db();
        const rooms = await db.collection("rooms").find({
            isAvailableForBooking: { $ne: false }
        }).toArray();

        return rooms.filter(room => {
            const reservations = Array.isArray(room.reservations)
                ? room.reservations
                : [];

            // Check whether any reservation overlaps the requested period.
            const hasConflict = reservations.some(reservation => {
                const status = String(reservation.status || "").toLowerCase();

                // Ignore canceled and completed reservations.
                if (status === "canceled" || status === "done") {
                    return false;
                }

                // Ignore room-level markers that aren't actual bookings.
                if (status === "not available") {
                    return true;
                }

                // A pending or current reservation blocks overlapping dates.
                return reservation.start < end &&
                       reservation.end > start;
            });

            return !hasConflict;
        });
    } finally {
        await client.close();
    }
}

// reservation
async function createReservation(roomId, reservation) {
    const client = await MongoClient.connect(mongoConnection);

    try {
        const db = client.db();
        const rooms = db.collection("rooms");

        const room = await rooms.findOne({
            _id: new ObjectId(roomId)
        });

        if (!room) {
            throw new Error("Room not found.");
        }

        const reservations = Array.isArray(room.reservations)
            ? room.reservations
            : [];

        const hasConflict = reservations.some(existing => {
            const status = String(existing.status || "").toLowerCase();

            if (status === "canceled" || status === "done") {
                return false;
            }

            if (status === "not available") {
                return true;
            }

            return (
                existing.start < reservation.end &&
                existing.end > reservation.start
            );
        });

        if (hasConflict) {
            throw new Error("This room is not available for these dates.");
        }

        await rooms.updateOne(
            { _id: new ObjectId(roomId) },
            {
                $push: {
                    reservations: reservation
                }
            }
        );

        return true;
    } finally {
        await client.close();
    }
}






async function updateReservationStatus(roomId, reservationIndex, newStatus) {
    const allowedStatuses = ["current", "done", "canceled"];

    if (!allowedStatuses.includes(newStatus)) {
        throw new Error("Invalid reservation status.");
    }

    const client = await MongoClient.connect(mongoConnection);

    try {
        const db = client.db();
        const rooms = db.collection("rooms");

        const room = await rooms.findOne({
            _id: new ObjectId(roomId)
        });

        if (!room) {
            throw new Error("Room not found.");
        }

        const reservations = Array.isArray(room.reservations)
            ? room.reservations
            : [];

        const index = Number(reservationIndex);

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= reservations.length
        ) {
            throw new Error("Reservation not found.");
        }

        const reservation = reservations[index];

        if (
            reservation.status === "canceled" ||
            reservation.status === "done"
        ) {
            throw new Error("This reservation cannot be updated.");
        }

        const result = await rooms.updateOne(
            {
                _id: new ObjectId(roomId),
                [`reservations.${index}.status`]: reservation.status
            },
            {
                $set: {
                    [`reservations.${index}.status`]: newStatus
                }
            }
        );

        if (result.modifiedCount === 0) {
            throw new Error("Reservation status was not updated.");
        }

        return true;
    } finally {
        await client.close();
    }
}

module.exports = {
    index,
    show,
    findAvailableRooms,
    createReservation,
    updateReservationStatus,
}