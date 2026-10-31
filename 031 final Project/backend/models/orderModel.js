
const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

const COLLECTION = 'orders';

async function withCollection(callback) {
    const client = new MongoClient(mongoConnection);

    try {
        await client.connect();
        const db = client.db();
        return await callback(db.collection(COLLECTION), db);
    } finally {
        await client.close();
    }
}

async function store(data) {
    const customer = data.customer;
    const requestedItems = data.items;

    if (
        !customer ||
        typeof customer.name !== 'string' ||
        !customer.name.trim() ||
        typeof customer.phone !== 'string' ||
        !customer.phone.trim() ||
        typeof customer.address !== 'string' ||
        !customer.address.trim()
    ) {
        throw new Error('Customer name, phone, and address are required');
    }

    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
        throw new Error('An order must contain at least one item');
    }

    return withCollection(async (orders, db) => {
        const savedItems = [];
        let total = 0;

        for (const requested of requestedItems) {
            if (!ObjectId.isValid(String(requested.itemId || ''))) {
                throw new Error('Invalid item ID');
            }

            const quantity = Number(requested.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                throw new Error('Item quantity must be a positive integer');
            }

            const item = await db.collection('items').findOne({
                _id: new ObjectId(String(requested.itemId)),
                isActive: { $ne: false }
            });

            if (!item) {
                throw new Error('An item was not found or is unavailable');
            }

            if (quantity > Number(item.quantity ?? 0)) {
                throw new Error(`Insufficient stock for ${item.name}`);
            }

            savedItems.push({
                itemId: item._id,
                name: item.name,
                price: Number(item.price),
                quantity
            });

            total += Number(item.price) * quantity;
        }

        const now = new Date();

        const order = {
            customer: {
                name: customer.name.trim(),
                phone: customer.phone.trim(),
                address: customer.address.trim()
            },
            items: savedItems,
            total,
            status: 'opened',
            notes: '',
            createdAt: now,
            updatedAt: now
        };

        return orders.insertOne(order);
    });
}

function index() {
    return withCollection(async (orders) => {
        return orders.find({}).sort({ createdAt: -1 }).toArray();
    });
}

function show(id) {
    if (!ObjectId.isValid(String(id))) {
        throw new Error('Invalid order ID');
    }

    return withCollection(async (orders) => {
        return orders.findOne({ _id: new ObjectId(String(id)) });
    });
}

function update(id, data) {
    if (!ObjectId.isValid(String(id))) {
        throw new Error('Invalid order ID');
    }

    const updates = {
        updatedAt: new Date()
    };

    if (data.status !== undefined) {
        if (!['opened', 'closed'].includes(data.status)) {
            throw new Error('Status must be opened or closed');
        }

        updates.status = data.status;
    }

    if (data.notes !== undefined) {
        if (typeof data.notes !== 'string') {
            throw new Error('Notes must be text');
        }

        updates.notes = data.notes.trim();
    }

    if (Object.keys(updates).length === 1) {
        throw new Error('No order changes provided');
    }

    return withCollection(async (orders) => {
        return orders.updateOne(
            { _id: new ObjectId(String(id)) },
            { $set: updates }
        );
    });
}

module.exports = { store, index, show, update };
