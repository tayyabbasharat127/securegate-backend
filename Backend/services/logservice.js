const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Login Event
const createloginEvent = async (userId, ipAddress, location, device, status) => {
  return prisma.loginEvent.create({
    data: {
      userId,
     ipAddress,
    
      device,
      status,
    },
  });
};

// Save Risk Score
const Saverisk = async (eventId, score, reason) => {
  return prisma.riskScore.create({
    data: {
      loginEventId: eventId,
      score,
      reason,
    },
  });
};

// Save Security Action
const saveaction = async (eventId, type, details) => {
  return prisma.securityAction.create({
    data: {
      loginEventId: eventId,
      actionType: type,
      details,
    },
  });
};

module.exports = { createloginEvent, Saverisk, saveaction };
