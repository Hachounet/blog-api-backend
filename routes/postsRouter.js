const { Router } = require("express");

const postsRouter = Router();

const {
  getAllPosts,
  getSpecificPostPage,
  getSpecificPostPageComments,
  postCommentAndLikesOnSpecificPostPage,
} = require("../controllers/postsController");

const authenticateJWT = require("../auth/passport");
const optionalAuthenticateJWT = require("../auth/optionalPassport");
const customAuthenticateJWT = require("../auth/customAuthenticateJWT");

postsRouter.get("/", getAllPosts);

postsRouter.get("/:postId", customAuthenticateJWT, getSpecificPostPage);

postsRouter.get(
  "/:postId/comments/:commentsPage",
  optionalAuthenticateJWT,
  getSpecificPostPageComments,
);

postsRouter.post(
  "/:postId",
  authenticateJWT,
  postCommentAndLikesOnSpecificPostPage,
);

module.exports = postsRouter;
