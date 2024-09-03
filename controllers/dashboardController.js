const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

exports.getAllPostsPage = asyncHandler(async (req, res, next) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      published: "asc",
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      published: true,

      author: {
        select: {
          pseudo: true,
        },
      },
      _count: {
        select: {
          Comment: true,
        },
      },
      Content: true,
    },
  });
  res.json({ posts });
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

exports.getCommentsPage = asyncHandler(async (req, res, next) => {
  const comments = await prisma.comment.findMany({
    where: { authorized: false },
    include: {
      author: {
        select: {
          pseudo: true,
        },
      },
    },
  });
  res.json({ comments });
});

exports.postCommentsPage = asyncHandler(async (req, res, next) => {
  if (req.query.authorized === "false") {
    await prisma.comment.delete({
      where: {
        id: req.query.commentId,
      },
    });
  } else if (req.query.authorized === "true") {
    await prisma.comment.update({
      where: {
        id: req.query.commentId,
      },
      data: {
        authorized: true,
      },
    });
  }
  const comments = await prisma.comment.findMany({
    where: { authorized: false },
    include: {
      author: {
        select: {
          pseudo: true,
        },
      },
    },
  });
  res.json({ comments });
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
