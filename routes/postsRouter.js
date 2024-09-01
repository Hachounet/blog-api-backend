const { Router } = require("express");
const postsRouter = Router();
const {
  getAllPosts,
  getSpecificPostPage,
  getSpecificPostPageComments,
  postCommentAndLikesOnSpecificPostPage,
} = require("../controllers/postsController");

const {
  authenticateJWT,
  optionalAuthenticateJWT,
} = require("../auth/passport");
const customAuthenticateJWT = require("../auth/customAuthenticateJWT");

postsRouter.get("/", getAllPosts);

postsRouter.get("/:postId", customAuthenticateJWT, getSpecificPostPage);

postsRouter.get(
  "/:postId/comments/:commentsPage",
  customAuthenticateJWT,
  getSpecificPostPageComments,
);

postsRouter.post(
  "/:postId",
  authenticateJWT,
  postCommentAndLikesOnSpecificPostPage,
);

module.exports = postsRouter;
