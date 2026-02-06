import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "./models/category.model.js";
import { Product } from "./models/product.model.js";

dotenv.config();

// Sample categories (no categoryId needed — auto-generated)
const categoriesData = [
  { name: "Fiction", description: "Novels, stories, and literature" },
  { name: "Science", description: "Science books and journals" },
  { name: "History", description: "Historical books and biographies" },
  { name: "Children", description: "Books for kids and young readers" },
  { name: "Self-Help", description: "Personal development books" }
];

// Sample books
const productData = [
  {
    "name": "How to Grow Your Online Store",
    "description": "Learn the best strategies to grow your online store in today's competitive market.",
    "coverImage": "book-1.png",
    "inventory_count": 10,
    "oldPrice": 29.99,
    "newPrice": 19.99,
    "isbn": "456776878656"
  },
  {
    "name": "Top 10 Fiction Books This Year",
    "description": "A curated list of the best fiction books that are trending this year.",
    "inventory_count": 20,
    "coverImage": "book-2.png",
    "oldPrice": 24.99,
    "newPrice": 14.99,
    "isbn": "45657878764"
  },
  {
    "name": "Mastering SEO in 2024",
    "description": "Tips and tricks to boost your SEO and rank higher on search engines.",
    "inventory_count": 30,
    "coverImage": "book-3.png",
    "oldPrice": 39.99,
    "newPrice": 29.99,
    "isbn": "34567678789"
  },
  {
    "name": "Best eCommerce Platforms",
    "description": "A comprehensive guide on choosing the best eCommerce platforms for 2024.",
    "inventory_count": 40,
    "coverImage": "book-4.png",
    "oldPrice": 49.99,
    "newPrice": 39.99,
    "isbn": "987654345"
  },
  {
    "name": "Non-Fiction Reads You Must Try",
    "description": "Our top picks for non-fiction books to add to your reading list.",
    "inventory_count": 50,
    "coverImage": "book-5.png",
    "oldPrice": 19.99,
    "newPrice": 9.99,
    "isbn": "7564523445"
  },
  {
    "name": "Ultimate Guide to Digital Marketing",
    "description": "A complete guide to digital marketing strategies for 2024.",
    "inventory_count": 60,
    "coverImage": "book-6.png",
    "oldPrice": 44.99,
    "newPrice": 34.99,
    "isbn": "78654632343"
  },
  {
    "name": "The First Days",
    "description": "Katie is driving to work one beautiful day when a dead man jumps into her car and tries to eat her.  That same morning, Jenni opens a bedroom door to find her husband devouring their toddler son. ",
    "inventory_count": 30,
    "coverImage": "book-7.png",
    "oldPrice": 59.99,
    "newPrice": 49.99,
    "isbn": "34566567865"
  },
  {
    "name": "The Hunger Games",
    "description": "Could you survive on your own in the wild, with every one out to make sure you don't live to see the morning?",
    "inventory_count": 10,
    "coverImage": "book-8.png",
    "oldPrice": 21.99,
    "newPrice": 16.99,
    "isbn": "654565657546"
  },
  {
    "name": "Harry Potter and the Order of the Phoenix",
    "description": "Harry Potter is about to start his fifth year at Hogwarts School of Witchcraft and Wizardry. Unlike most schoolboys, Harry never enjoys his summer holidays",
    "inventory_count": 10,
    "coverImage": "book-9.png",
    "oldPrice": 27.99,
    "newPrice": 18.99,
    "isbn": "765654543656"
  },
  {
    "name": "Pride and Prejudice",
    "description": "The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring.",
    "inventory_count": 40,
    "coverImage": "book-10.png",
    "oldPrice": 14.99,
    "newPrice": 10.99,
    "isbn": "09876543235"
  },
  {
    "inventory_count": 11,
    "name": "To Kill a Mockingbird",
    "description": "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. 'To Kill A Mockingbird' became both an instant bestseller",
    "coverImage": "book-11.png",
    "oldPrice": 32.99,
    "newPrice": 25.99,
    "isbn": "34567878999"
  },
  {
    "inventory_count": 12,
    "name": "The Fault in Our Stars",
    "description": "Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. ",
    "coverImage": "book-12.png",
    "oldPrice": 19.99,
    "newPrice": 9.99,
    "isbn": "23435676"
  },
  {
    "inventory_count": 13,
    "name": "The Picture of Dorian Gray",
    "description": "Oscar Wilde’s only novel is the dreamlike story of a young man who sells his soul for eternal youth and beauty.",
    "coverImage": "book-13.png",
    "oldPrice": 26.99,
    "newPrice": 21.99,
    "isbn": "3567879898"
  },
  {
    "inventory_count": 14,
    "name": "The Giving Tree",
    "description": "'Once there was a tree...and she loved a little boy.'So begins a story of unforgettable perception, beautifully written and illustrated by the gifted and versatile Shel Silverstein.",
    "coverImage": "book-14.png",
    "oldPrice": 34.99,
    "newPrice": 24.99,
    "isbn": "68998786755"
  },
  {
    "inventory_count": 15,
    "name": "Gone with the Wind",
    "description": "Scarlett O'Hara, the beautiful, spoiled daughter of a well-to-do Georgia plantation owner, must use every means at her disposal to claw her way out of the poverty she finds herself in after Sherman's March to the Sea.",
    "coverImage": "book-15.png",
    "oldPrice": 22.99,
    "newPrice": 12.99,
    "isbn": "3243657654"
  },
  {
    "inventory_count": 16,
    "name": "The Lightning Thief",
    "description": "Percy Jackson is a good kid, but he can't seem to focus on his schoolwork or control his temper. And lately, being away at boarding school is only getting worse - Percy could have sworn his pre-algebra teacher turned into a monster and tried to kill him",
    "coverImage": "book-16.png",
    "oldPrice": 24.99,
    "newPrice": 19.99,
    "isbn": "2349385434"
  },
  {
    "inventory_count": 17,
    "name": "Alice’s Adventures in Wonderland",
    "description": "When Alice sees a white rabbit take a watch out of its waistcoat pocket she decides to follow it, and a sequence of most unusual events is set in motion. This mini book contains the entire topsy-turvy stories of Alice's Adventures in Wonderland",
    "coverImage": "book-17.png",
    "oldPrice": 49.99,
    "newPrice": 39.99,
    "isbn": "34567654343"
  },
  {
    "inventory_count": 18,
    "name": "Divergent",
    "description": "On an appointed day of every year, all sixteen-year-olds must select the faction to which they will devote the rest of their lives. For Beatrice, the decision is between staying with her family and being who she really is",
    "coverImage": "book-18.png",
    "oldPrice": 18.99,
    "newPrice": 12.99,
    "isbn": "12344354534"
  },
  {
    "inventory_count": 19,
    "name": "The Alchemist",
    "description": "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    "coverImage": "book-19.png",
    "oldPrice": 35.99,
    "newPrice": 27.99,
    "isbn": "5843842392"
  },
  {
    "inventory_count": 20,
    "name": "Four Thousand Weeks",
    "description": "Nobody needs to be told there isn’t enough time. We’re obsessed with our lengthening to-do lists, overfilled inboxes, work-life balance, and ceaseless battle against distraction; we’re deluged with advice on becoming more productive and efficient",
    "coverImage": "book-20.png",
    "oldPrice": 24.99,
    "newPrice": 14.99,
    "isbn": "35467878765"
  }
];

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected...");

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    console.log("Old data cleared.");

    // Seed categories
    const savedCategories = [];
    for (const cat of categoriesData) {
      const newCat = new Category(cat);
      await newCat.save();
      console.log(`Seeded category: ${newCat.name} (${newCat.categoryId})`);
      savedCategories.push(newCat);
    }

    // Seed books, assigning categoryId in round-robin
    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];
      const category = savedCategories[i % savedCategories.length];
      const newProduct = new Product({
        ...product,
        category: category._id
      });
      await newProduct.save();
      console.log(`Seeded product: ${product.name} (Category: ${category.name})`);
    }

    console.log("All data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedAll();
