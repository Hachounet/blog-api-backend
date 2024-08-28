const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Custom errors //

const length3to20Err = "must be between 3 and 20 characters.";
const notEmpty = "must not be empty.";
const mailFormat = "Invalid email format.";
const length6 = "must be 6 characters min.";

function checkForJSAttack(value) {
  const regex = /<script.*?>.*?<\/script>/i; // Regex to check for JS code
  if (regex.test(value)) {
    throw new Error("Username cannot contain JavaScript code.");
  }
  const invalidChars = /[^a-zA-Z0-9-_]/; // Allow letters, numbers, - and _
  if (invalidChars.test(value)) {
    throw new Error(
      "Username can only contain alphanumeric characters, dashes and underscores.",
    );
  }
  return true;
}

const validateSignUp = [
  body("pseudo")
    .trim() // Delete white spaces
    .escape() // Escape HTML characters
    .notEmpty()
    .withMessage(`Pseudo ${notEmpty}`)
    .isLength({ min: 3, max: 20 })
    .withMessage(`Pseudo ${length3to20Err}`)
    .custom(checkForJSAttack),
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage(`Email ${notEmpty}`)
    .normalizeEmail()
    .isEmail()
    .withMessage(`${mailFormat}`),
  body("pw")
    .notEmpty()
    .withMessage(`Password ${notEmpty}`)
    .trim()
    .isLength({ min: 6 })
    .withMessage(`Password ${length6}`)
    .custom(checkForJSAttack)
    .custom((value, { req }) => {
      if (value !== req.body.confpw) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.getLandingPage = asyncHandler(async (req, res, next) => {
  console.log("Landing Page");

  const allPosts = await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc", // Trier par date de création (ordre décroissant)
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      author: {
        select: {
          pseudo: true,
        },
      },
      _count: {
        select: {
          Comment: true, // Compter le nombre de commentaires
        },
      },
      Content: true,
    },
  });

  res.json(allPosts);
});

exports.getLoginPage = (req, res, next) => {
  console.log("GET Login Page");
  res.json({ message: "Please enter email and password." });
};

exports.postLoginPage = asyncHandler(async (req, res, next) => {
  console.log("POST Login Page for:", req.body.email);

  // Initialiser un tableau pour stocker les erreurs
  const errors = [];

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  // Vérifier si l'utilisateur existe
  if (!user) {
    errors.push({ msg: "Invalid email." });
  }

  // Compare the password only if the user exists
  let isPasswordValid = true; // Assume true if user does not exist
  if (user) {
    isPasswordValid = await bcrypt.compare(req.body.pw, user.hash);
    if (!isPasswordValid) {
      errors.push({ msg: "Invalid password." });
    }
  }

  // Si des erreurs ont été trouvées, retourner les erreurs
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Générer le token si aucune erreur n'est trouvée
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "120000",
  });

  return res.status(200).json({ message: "User logged in", accessToken });
});

exports.getProfilePage = asyncHandler(async (req, res, next) => {
  res.json({ message: "Access granted.", user: req.user });
  // No need to ask DB about user because authenticateJWT did it before
});

exports.getLogOutPage = (req, res, next) => {
  console.log("GET Log Out Page");
  res.json({ message: "Do you really want to leave ?" });
};

exports.postLogOutPage = (req, res, next) => {
  console.log("POST Log Out Page");
  res.json({ message: "I should here delete JWT from LocalStorage" });
};

exports.getAboutPage = asyncHandler(async (req, res, next) => {
  console.log("GET About Page");
  try {
    const aboutPage = await prisma.pageContent.findFirst({
      where: { id: "about-us" },
      select: { content: true },
    });

    if (!aboutPage) {
      const error = new Error("About page not found.");
      error.status = 404;
      return next(error);
    }

    res.json({ aboutPage });
  } catch (error) {
    next(error);
  }
});

exports.getSignUpPage = (req, res, next) => {
  console.log("GET Sign Up Page");
  res.json({ message: "Join us today and be part of a great community !" });
};

exports.postSignUpPage = [
  validateSignUp,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bcrypt.hash(req.body.pw, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      try {
        await prisma.user.create({
          data: {
            email: req.body.email,
            pseudo: req.body.pseudo,
            hash: hashedPassword,
          },
        });
        return res
          .status(200)
          .json({ success: true, message: "Account successfully created !" });
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Something went wrong. Please try again." });
      }
    });
  }),
];
