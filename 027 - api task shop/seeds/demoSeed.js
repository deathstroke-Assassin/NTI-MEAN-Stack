require('dotenv').config();
const { MongoClient, ObjectId, mongoConnection } = require('../models/mongodbConnection');

const SEED_BATCH = 'casual-shop-demo-v1';
const categories = [
    { name: 'Electronics', description: 'Everyday electronic devices and accessories.' },
    { name: 'Clothing', description: 'Casual clothing for everyday wear.' },
    { name: 'Home & Kitchen', description: 'Useful items for the home and kitchen.' },
    { name: 'Beauty & Personal Care', description: 'Personal care and beauty essentials.' },
    { name: 'Sports & Fitness', description: 'Equipment and accessories for active living.' }
];
const productNames = [
    ['Wireless Headphones', 'Bluetooth Speaker', 'USB-C Charger', 'Power Bank', 'Mechanical Keyboard', 'Wireless Mouse', 'Smart Watch', 'Webcam', 'Desk Lamp', 'Phone Stand'],
    ['Cotton T-Shirt', 'Casual Hoodie', 'Denim Jeans', 'Canvas Jacket', 'Everyday Sneakers', 'Knit Sweater', 'Relaxed Chinos', 'Baseball Cap', 'Cotton Socks', 'Crossbody Bag'],
    ['Ceramic Mug Set', 'Glass Food Containers', 'Chef Knife', 'Cutting Board', 'Electric Kettle', 'Storage Basket', 'Cotton Towel Set', 'Table Lamp', 'Water Bottle', 'Lunch Box'],
    ['Daily Face Cleanser', 'Moisturizing Cream', 'Sunscreen SPF 50', 'Shampoo', 'Conditioner', 'Hand Lotion', 'Hair Brush', 'Body Wash', 'Lip Balm Set', 'Travel Toiletry Kit'],
    ['Yoga Mat', 'Resistance Band Set', 'Running Bottle', 'Training Gloves', 'Jump Rope', 'Foam Roller', 'Sports Towel', 'Gym Duffle Bag', 'Fitness Tracker', 'Workout Socks']
];
const firstNames = ['Mariam', 'Omar', 'Nour', 'Youssef', 'Laila', 'Adam', 'Salma', 'Karim', 'Farah', 'Hana', 'Ziad', 'Mina', 'Aya', 'Malek', 'Jana'];
const lastNames = ['Adel', 'Hassan', 'Kamal', 'Nabil', 'Fathy', 'Said', 'Ibrahim', 'Mahmoud', 'Ramy', 'Farouk'];
const streets = ['Tahrir Street', 'Nile Street', 'Garden City Road', 'El Hegaz Street', 'Zamalek Street', 'Maadi Road', 'Nasr City Avenue'];
const statuses = ['Pending', 'In Progress', 'Completed'];

function randomGenerator(seed) {
    let value = seed >>> 0;
    return () => {
        value += 0x6D2B79F5;
        let next = value;
        next = Math.imul(next ^ next >>> 15, next | 1);
        next ^= next + Math.imul(next ^ next >>> 7, next | 61);
        return ((next ^ next >>> 14) >>> 0) / 4294967296;
    };
}

function twoMonthsBefore(date) {
    const result = new Date(date);
    const originalDay = result.getUTCDate();
    result.setUTCDate(1);
    result.setUTCMonth(result.getUTCMonth() - 2);
    const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
    result.setUTCDate(Math.min(originalDay, lastDay));
    return result;
}

function sample(list, random) {
    return list[Math.floor(random() * list.length)];
}

async function seedDemoData() {
    if (!mongoConnection) throw new Error('MONGODB_CONNECTION is not configured.');
    const client = new MongoClient(mongoConnection);
    await client.connect();
    try {
        const db = client.db();
        const categoryCollection = db.collection('categories');
        const productCollection = db.collection('products');
        const orderCollection = db.collection('orders');

        // Only replace this script's own sample records; preserve employee data.
        const targets = { categories: 5, products: 50, orders: 150 };
        const [existingCategories, existingProducts, existingOrders] = await Promise.all([
            categoryCollection.countDocuments({ seedBatch: { $ne: SEED_BATCH } }),
            productCollection.countDocuments({ seedBatch: { $ne: SEED_BATCH } }),
            orderCollection.countDocuments({ seedBatch: { $ne: SEED_BATCH } })
        ]);
        const existing = { categories: existingCategories, products: existingProducts, orders: existingOrders };
        const overTarget = Object.keys(targets).filter(name => existing[name] > targets[name]);
        if (overTarget.length) {
            throw new Error(`Existing unseeded ${overTarget.join(', ')} records exceed requested totals. No sample records were changed.`);
        }

        await orderCollection.deleteMany({ seedBatch: SEED_BATCH });
        await productCollection.deleteMany({ seedBatch: SEED_BATCH });
        await categoryCollection.deleteMany({ seedBatch: SEED_BATCH });

        const existingCategoryNames = new Set((await categoryCollection.find({ seedBatch: { $ne: SEED_BATCH } }, { projection: { name: 1 } }).toArray()).map(category => category.name));
        const categoryDocs = categories
            .filter(category => !existingCategoryNames.has(category.name))
            .slice(0, targets.categories - existing.categories)
            .map(category => ({ ...category, seedBatch: SEED_BATCH }));
        if (categoryDocs.length) await categoryCollection.insertMany(categoryDocs);
        const categoryIds = (await categoryCollection.find({}, { projection: { _id: 1 } }).toArray()).map(category => category._id);
        const random = randomGenerator(20261024);

        const productSpecs = productNames.flatMap((names, categoryIndex) => names.map((name, itemIndex) => ({ name, categoryIndex, itemIndex })))
            .slice(0, targets.products - existing.products);
        const productDocs = productSpecs.map(({ name, categoryIndex, itemIndex }) => ({
            name,
            price: Number((35 + ((categoryIndex + 2) * 17.5) + (itemIndex * 23.25) + Math.floor(random() * 80)).toFixed(2)),
            photo: '',
            categoryId: categoryIds[categoryIndex % categoryIds.length],
            seedBatch: SEED_BATCH
        }));
        const productResult = productDocs.length ? await productCollection.insertMany(productDocs) : null;
        const insertedProductIds = productResult ? Object.values(productResult.insertedIds) : [];
        const insertedProducts = productDocs.map((product, index) => ({ ...product, _id: insertedProductIds[index] }));

        const now = new Date();
        const start = twoMonthsBefore(now);
        const intervalMs = now.getTime() - start.getTime();
        const orderDocs = Array.from({ length: targets.orders - existing.orders }, (_, index) => {
            const selectedProduct = insertedProducts[Math.floor(random() * insertedProducts.length)];
            const quantity = 1 + Math.floor(random() * 5);
            const orderDateTime = new Date(start.getTime() + Math.floor(random() * intervalMs));
            const fullName = `${sample(firstNames, random)} ${sample(lastNames, random)}`;
            const line = {
                productID: selectedProduct._id,
                productName: selectedProduct.name,
                quantity,
                piecePrice: selectedProduct.price
            };
            const transitions = Math.floor(random() * 3);
            const status = [{ statusName: 'Pending', statusDateTime: orderDateTime }];
            if (transitions >= 1) status.push({ statusName: 'In Progress', statusDateTime: new Date(orderDateTime.getTime() + Math.floor(random() * Math.max(1, now.getTime() - orderDateTime.getTime()))) });
            if (transitions >= 2) status.push({ statusName: 'Completed', statusDateTime: new Date(status[status.length - 1].statusDateTime.getTime() + Math.floor(random() * Math.max(1, now.getTime() - status[status.length - 1].statusDateTime.getTime()))) });
            return {
                customer: {
                    customerName: fullName,
                    customerPhone: `01${String(100000000 + Math.floor(random() * 899999999)).slice(0, 9)}`,
                    customerAddress: `${10 + Math.floor(random() * 180)} ${sample(streets, random)}, Cairo`
                },
                product: line,
                products: [line],
                quantity,
                total: Number((quantity * selectedProduct.price).toFixed(2)),
                status,
                orderDateTime,
                seedBatch: SEED_BATCH,
                seedIndex: index + 1
            };
        });
        if (orderDocs.length) await orderCollection.insertMany(orderDocs);

        const totals = {
            seeded: { categories: categoryDocs.length, products: productDocs.length, orders: orderDocs.length },
            database: {
                categories: await categoryCollection.countDocuments(),
                products: await productCollection.countDocuments(),
                orders: await orderCollection.countDocuments()
            },
            orderDateRangeUtc: { from: start.toISOString(), to: now.toISOString() }
        };
        console.log(JSON.stringify(totals, null, 2));
        return totals;
    } finally {
        await client.close();
    }
}

if (require.main === module) {
    seedDemoData().catch(error => {
        console.error(`Demo seed failed: ${error.message}`);
        process.exitCode = 1;
    });
}

module.exports = { seedDemoData, SEED_BATCH };
