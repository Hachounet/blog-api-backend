const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

exports.getDashboardPage = asyncHandler(async (req, res, next) => {
  const drafts = await prisma.post.findMany({
    where: {
      published: false,
    },
  });
  const commentsToCheck = await prisma.comment.findMany({
    where: {
      authorized: false,
    },
  });

  return res.status(200).json({ drafts, commentsToCheck });
});

exports.getDraftsPage = asyncHandler(async (req, res, next) => {
  const drafts = await prisma.post.findMany({
    where: {
      published: false,
    },
    include: {
      author: {
        select: {
          pseudo: true,
        },
      },
    },
  });

  return res.status(200).json({ drafts });
});

exports.getCreatePostPage = asyncHandler(async (req, res, next) => {
  console.log("Check if needed with Front end ");
  res.json({ message: "Maybe not needed." });
});

exports.postCreatePostPage = asyncHandler(async (req, res, next) => {
  console.log("Check with Front end");
  res.json({ message: "Check after front end" });
});

exports.getAllPostsPage = asyncHandler(async (req, res, next) => {
  const posts = await prisma.post.findMany();
  res.json({ posts });
});

exports.getCommentsPage = asyncHandler(async (req, res, next) => {
  const comments = await prisma.comment.findMany({
    where: { authorized: false },
  });
  res.json({ comments });
});

exports.postCommentsPage = asyncHandler(async (req, res, next) => {
  if (req.query.authorized === false) {
    await prisma.comment.delete({
      where: {
        id: req.query.commentId,
      },
    });
  } else {
    await prisma.comment.update({
      where: {
        id: req.query.commentId,
        authorized: req.query.authorized,
      },
    });
  }

  res.status(200).json({ message: "Comment edited." });
});

exports.getDeletePage = asyncHandler(async (req, res, next) => {
  console.log("Probably not needed");
  res.json({ message: " Probably not needed." });
});

exports.postDeletePage = asyncHandler(async (req, res, next) => {
  console.log("brr");
  await prisma.post.delete({
    where: {
      id: req.query.postId,
    },
  });
});

exports.getUpdatePostPage = asyncHandler(async (req, res, next) => {
  console.log("Probably not needed");
  res.json({ message: "Probably not needed. Check with front end." });
});

exports.postUpdatePostPage = asyncHandler(async (req, res, next) => {
  console.log("Check after front end");
  res.json({ message: "Check after front end." });
});
