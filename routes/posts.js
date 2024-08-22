const { Router } = require("express");

const postsRouter = Router();

postsRouter.get("/", getAllPosts);

postsRouter.get("/:postId", getSpecificPostPage);

postsRouter.get("/:postId/comments/:commentsPage", getSpecificPostPageComments);

postsRouter.post("/:postId", postCommentSpecificPostPage);
