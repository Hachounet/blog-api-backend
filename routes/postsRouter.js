const { Router } = require("express");

const postsRouter = Router();

const {
  getAllPosts,
  getSpecificPostPage,
  getSpecificPostPageComments,
  postCommentAndLikesOnSpecificPostPage,
} = require("../controllers/postsController");

const authenticateJWT = require("../auth/passport");

postsRouter.get("/", getAllPosts);

postsRouter.get("/:postId", getSpecificPostPage);

postsRouter.get("/:postId/comments/:commentsPage", getSpecificPostPageComments);

postsRouter.post(
  "/:postId",
  authenticateJWT,
  postCommentAndLikesOnSpecificPostPage,
);

module.exports = postsRouter;
