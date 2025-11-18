const express = require("express");
const { PrismaClient } = require("@prisma/client");
import authroutes from './routes/auth';
const app = express();
const prisma = new PrismaClient();
require('dotenv').config();
app.use(express.json());
app.use('/api/auth',authroutes);
// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Start Server + Check DB
async function startServer() {
  try {
    await prisma.$connect();
    console.log(" Prisma connected to PostgreSQL!");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error(" Prisma connection failed:", error);
    process.exit(1);
  }
}

startServer();
