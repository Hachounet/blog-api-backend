const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.isEditor = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      role: true,
    },
  });

  if (user && user.role === "EDITOR") {
    next();
  } else {
    return res.status(401).json({ message: "You are not allowed." });
  }
});
