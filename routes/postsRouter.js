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
  twoStrategies,
} = require("../auth/passport");

postsRouter.get("/", getAllPosts);

postsRouter.get("/:postId", twoStrategies, getSpecificPostPage);

postsRouter.get(
  "/:postId/comments/:commentsPage",
  twoStrategies,
  getSpecificPostPageComments,
);

postsRouter.post(
  "/:postId",
  authenticateJWT,
  postCommentAndLikesOnSpecificPostPage,
);

module.exports = postsRouter;
