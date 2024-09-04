const { Router } = require("express");

const dashboardRouter = Router();

const {
  getCreatePostPage,
  postCreatePostPage,
  getAllPostsPage,
  getCommentsPage,
  postCommentsPage,
  getDeletePage,
  postDeletePage,
  getUpdatePostPage,
  postUpdatePostPage,
  getDraftsPage,
} = require("../controllers/dashboardController");

const { authenticateJWT } = require("../auth/passport");
const { isEditor } = require("../auth/editorMiddleware");

dashboardRouter.use(authenticateJWT);
dashboardRouter.use(isEditor);

dashboardRouter.get("/", getAllPostsPage);

dashboardRouter.get("/drafts", getDraftsPage);

dashboardRouter.post("/create", postCreatePostPage);

dashboardRouter.get("/all", getAllPostsPage);

dashboardRouter.get("/comments", getCommentsPage);

dashboardRouter.post("/comments", postCommentsPage);

dashboardRouter.post("/delete", postDeletePage);

dashboardRouter.get("/:postId/update", getUpdatePostPage);

dashboardRouter.post("/:postId/update", postUpdatePostPage);

module.exports = dashboardRouter;
