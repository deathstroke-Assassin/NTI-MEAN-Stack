const {
  MongoClient,
  ObjectId,
  mongoConnection,
} = require("./mongodbConnection");

const COLLECTION = "items";

// Support documents whose _id is either an ObjectId or a legacy string.
function idMatch(id) {
  if (!ObjectId.isValid(String(id))) {
    return { _id: String(id) };
  }

  return {
    $or: [{ _id: new ObjectId(String(id)) }, { _id: String(id) }],
  };
}

// Always close the connection, even when a query fails.
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

// Validate and normalize values shared by create/update operations.
function normalizeItem(data, { includePhoto = true } = {}) {
  if (typeof data.name !== "string" || !data.name.trim()) {
    throw new Error("Item name is required");
  }

  if (!ObjectId.isValid(String(data.categoryId || ""))) {
    throw new Error("A valid category ID is required");
  }

  const price = Number(data.price);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number");
  }

  const description = data.description ?? "";

  if (typeof description !== "string") {
    throw new Error("Description must be text");
  }

  const item = {
    name: data.name.trim(),
    description: description.trim(),
    price,
    categoryId: new ObjectId(String(data.categoryId)),
    updatedAt: new Date(),
  };

  if (includePhoto && data.photo !== undefined && data.photo !== "") {
    item.photo = data.photo;
  }

  if (data.isActive !== undefined) {
    if (data.isActive === true || data.isActive === "true") {
      item.isActive = true;
    } else if (data.isActive === false || data.isActive === "false") {
      item.isActive = false;
    } else {
      throw new Error("isActive must be true or false");
    }
  }
  return item;
}

// Manager: list all items, including inactive items and quantities.
function index() {
  return withCollection(async (items) => {
    return items
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { name: 1 },
        },
      ])
      .toArray();
  });
}

// Manager: find an item by ID.
function show(id) {
  return withCollection(async (items) => {
    return items
      .aggregate([
        { $match: idMatch(id) },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
  });
}

// Manager: create an item.
function store(data) {
  const item = normalizeItem(data);

  const quantity = Number(data.quantity ?? 0);

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer");
  }

  item.quantity = quantity;
  item.isActive = item.isActive ?? true;
  item.createdAt = new Date();

  return withCollection(async (items, db) => {
    const category = await db.collection("categories").findOne({
      _id: item.categoryId,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return items.insertOne(item);
  });
}

// Manager: retrieve the original document for an edit form.
function updateForm(id) {
  return withCollection(async (items) => {
    return items.find(idMatch(id)).toArray();
  });
}

// Manager: update an item. Existing photo is preserved if no new one is sent.
function update(data) {
  if (!ObjectId.isValid(String(data.id || ""))) {
    throw new Error("Invalid item ID");
  }

  const item = normalizeItem(data);
  const quantity = Number(data.quantity);

  if (data.quantity !== undefined) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("Quantity must be a non-negative integer");
    }

    item.quantity = quantity;
  }

  return withCollection(async (items, db) => {
    const category = await db.collection("categories").findOne({
      _id: item.categoryId,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return items.updateOne(idMatch(data.id), { $set: item });
  });
}

// Manager: delete an item.
function destroy(id) {
  return withCollection(async (items) => {
    return items.deleteOne(idMatch(id));
  });
}

module.exports = {
  index,
  show,
  store,
  updateForm,
  update,
  destroy,
};
