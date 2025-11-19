const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { calculateriskscore } = require("../services/riskservice");
const { createloginEvent, Saverisk, saveaction } = require("../services/logservice");

exports.registeruser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, username, password: hash },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ip = req.ip || req.headers["x-forwarded-for"];
    const device = req.headers["user-agent"];

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const last = await prisma.loginEvent.findFirst({
      where: { userId: user.id },
      orderBy: { loginTime: "desc" },
    });

    const { score, reasons, country } = await calculateriskscore(
      ip,
      device,
      last
    );

    const event = await createloginEvent(
      user.id,
      ip,
      country,
      device,
      score > 70 ? "BLOCKED" : "SUCCESS"
    );

    if (score > 0) {
      await Saverisk(event.id, score, reasons.join(", "));
    }

    if (score > 70) {
      await saveaction(event.id, "BLOCK LOGIN", "High risk login detected");

      return res.status(403).json({
        message: "LOGIN BLOCKED",
        score,
        reasons,
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret missing" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      score,
      reasons,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message || "Auth failed" });
  }
};
exports.loginhistory = async(req,res)=>{
   try {
    const logs = await prisma.loginEvent.findMany({
      where: { userId: req.user.userId },
      orderBy: { loginTime: "desc" },
     
    });

    const history = logs.map(log => ({
      id: log.id,
      ipAddress: log.ipAddress,
      country: log.country,
      device: log.device,
      status: log.status,
      loginTime: log.loginTime,
     riskScore: log.riskScore?.score || 0,
reason: log.riskScore?.reason || "",
    }));

    res.json(history);

  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "Failed to fetch login history" });
  }
};
