const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoConnection = process.env.MONGODB_CONNECTION;
console.log(mongoConnection);
module.exports = {
    MongoClient,
    ObjectId,
    mongoConnection,
};

async function seedRooms() {
    let client;

    try {
        client = await MongoClient.connect(mongoConnection);

        const db = client.db();
        const roomsCollection = db.collection("rooms");

        // Generate 100 rooms: A01-A25, B01-B25, C01-C25, D01-D25
        const rooms = [];

        for (const level of ["A", "B", "C", "D"]) {
            for (let number = 1; number <= 25; number++) {
                const roomName = `${level}${String(number).padStart(2, "0")}`;

                rooms.push({
                    roomName,
                    isAvailableForBooking: true,
                    reservations: []
                });
            }
        }

        // Add a few sample reservations for testing
        rooms.find(room => room.roomName === "A01").reservations.push({
            clientName: "Ahmed",
            payment: 1200,
            start: "2026-10-14",
            end: "2026-10-20",
            status: "done"
        });

        rooms.find(room => room.roomName === "B12").reservations.push({
            clientName: "Mohamed",
            payment: 1800,
            start: "2026-10-20",
            end: "2026-10-23",
            status: "pending"
        });

        rooms.find(room => room.roomName === "C05").reservations.push({
            clientName: "Omar",
            payment: 2500,
            start: "2026-10-15",
            end: "2026-10-19",
            status: "current"
        });

        // Prevent duplicate seeding
        const existingRooms = await roomsCollection.countDocuments();

        if (existingRooms > 0) {
            console.log(
                `Seeding cancelled: the rooms collection already contains ${existingRooms} documents.`
            );
            return;
        }

        await roomsCollection.insertMany(rooms);

        console.log("Successfully seeded 100 rooms!");
        console.log("Levels: A, B, C, D");
        console.log("Rooms per level: 25");
        console.log("Sample reservations added: A01, B12, C05");

    } catch (error) {
        console.error("Error seeding rooms:", error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

seedRooms();
