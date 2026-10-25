
require("dotenv").config();
const mongoose = require("mongoose");

const Category = require("../models/Category");

const categories = [
  { categoryName: "Electronics" },
  { categoryName: "Clothing" },
  { categoryName: "Home & Kitchen" },
  { categoryName: "Beauty & Personal Care" },
  { categoryName: "Sports & Fitness" },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Prevent duplicate category names when rerunning the seeder.
    for (const category of categories) {
      await Category.updateOne(
        { categoryName: category.categoryName },
        { $setOnInsert: category },
        { upsert: true }
      );
    }

    const total = await Category.countDocuments();

    console.log("Categories seeded successfully!");
    console.log(`Total categories in database: ${total}`);
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();

