const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

const ORDER_STATUSES = ['Pending', 'In Progress', 'Completed'];

async function withDb(callback) {
    const client = await MongoClient.connect(mongoConnection);
    try {
        return await callback(client.db());
    } finally {
        await client.close();
    }
}

async function index(filters = {}) {
    return withDb(async db => {
        const query = {};
        if (filters.status) {
            if (!ORDER_STATUSES.includes(filters.status)) {
                throw Object.assign(new Error('Choose a valid order status.'), { status: 400 });
            }
            query.$expr = { $eq: [{ $arrayElemAt: ['$status.statusName', -1] }, filters.status] };
        }
        if (filters.date) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(filters.date)) {
                throw Object.assign(new Error('Date must use YYYY-MM-DD format.'), { status: 400 });
            }
            const start = new Date(`${filters.date}T00:00:00.000Z`);
            if (!Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== filters.date) {
                throw Object.assign(new Error('Choose a valid calendar date.'), { status: 400 });
            }
            const end = new Date(start);
            end.setUTCDate(end.getUTCDate() + 1);
            query.orderDateTime = { $gte: start, $lt: end };
        }
        const orders = await db.collection('orders').find(query).sort({ orderDateTime: -1 }).toArray();
        return orders.map(order => ({
            ...order,
            currentStatus: order.status?.[order.status.length - 1]?.statusName || 'Pending'
        }));
    });
}

async function create(data) {
    const customer = data.customer && typeof data.customer === 'object' ? data.customer : data;
    const customerName = typeof customer.customerName === 'string' ? customer.customerName.trim() : '';
    const customerPhone = typeof customer.customerPhone === 'string' ? customer.customerPhone.trim() : '';
    const customerAddress = typeof customer.customerAddress === 'string' ? customer.customerAddress.trim() : '';
    const requestedLines = Array.isArray(data.products)
        ? data.products
        : data.product && typeof data.product === 'object'
            ? [{ productId: data.product.productId || data.product.productID || data.product.id, quantity: data.quantity ?? data.product.quantity }]
            : typeof data.product === 'string'
                ? [{ productId: data.product, quantity: data.quantity }]
            : (Array.isArray(data.productId) ? data.productId : [data.productId])
                .map((productId, index) => ({ productId, quantity: Array.isArray(data.quantity) ? data.quantity[index] : data.quantity }));

    if (!customerName || !customerPhone || !customerAddress) {
        throw Object.assign(new Error('Customer name, phone, and address are required.'), { status: 400 });
    }

    const requested = new Map();
    requestedLines.forEach(line => {
        const id = line?.productId;
        if (!id) return;
        if (!ObjectId.isValid(id)) throw Object.assign(new Error('A selected product is invalid.'), { status: 400 });
        const quantity = Number(line.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw Object.assign(new Error('Each product quantity must be a positive whole number.'), { status: 400 });
        }
        requested.set(String(id), (requested.get(String(id)) || 0) + quantity);
    });
    if (!requested.size) throw Object.assign(new Error('Add at least one product to the order.'), { status: 400 });

    return withDb(async db => {
        const ids = [...requested.keys()].map(id => new ObjectId(id));
        const catalog = await db.collection('products').find({ _id: { $in: ids } }).toArray();
        if (catalog.length !== ids.length) throw Object.assign(new Error('One or more products no longer exist.'), { status: 400 });
        const byId = new Map(catalog.map(product => [String(product._id), product]));
        const products = [...requested].map(([id, quantity]) => {
            const product = byId.get(id);
            return {
                productID: product._id,
                productName: product.name,
                quantity,
                piecePrice: Number(product.price)
            };
        });
        const total = products.reduce((sum, product) => sum + product.quantity * product.piecePrice, 0);
        const quantity = products.reduce((sum, product) => sum + product.quantity, 0);
        const order = {
            customer: { customerName, customerPhone, customerAddress },
            products,
            product: products.length === 1 ? products[0] : products,
            quantity,
            total: Number(total.toFixed(2)),
            status: [{ statusName: 'Pending', statusDateTime: new Date() }],
            orderDateTime: new Date()
        };
        const result = await db.collection('orders').insertOne(order);
        return { ...order, _id: result.insertedId, currentStatus: 'Pending' };
    });
}

async function show(id) {
    if (!ObjectId.isValid(id)) return null;
    return withDb(async db => {
        const order = await db.collection('orders').findOne({ _id: new ObjectId(String(id)) });
        return order && { ...order, currentStatus: order.status?.[order.status.length - 1]?.statusName || 'Pending' };
    });
}

async function updateStatus(id, statusName) {
    if (!ObjectId.isValid(id)) throw Object.assign(new Error('A valid order id is required.'), { status: 400 });
    if (!ORDER_STATUSES.includes(statusName)) throw Object.assign(new Error('Choose a valid order status.'), { status: 400 });
    return withDb(async db => {
        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(String(id)) },
            { $push: { status: { statusName, statusDateTime: new Date() } } }
        );
        return result.matchedCount > 0;
    });
}

module.exports = { ORDER_STATUSES, index, create, show, updateStatus };
