const { Router } = require("express");

const dashboardRouter = Router();

const {
  getAllPostsPage,
  getDraftsPage,
  postCreatePostPage,
  getCommentsPage,
  postCommentsPage,
  postDeletePage,
  getUpdatePostPage,
  putUpdatePostPage,
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

dashboardRouter.get("/update", getUpdatePostPage);

dashboardRouter.put("/update", putUpdatePostPage);

module.exports = dashboardRouter;
