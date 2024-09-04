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

exports.postCreatePostPage = asyncHandler(async (req, res, next) => {
  const { title, content, authorId } = req.body;

  await prisma.post.create({
    data: {
      title: title,
      Content: content,
      authorId: authorId,
    },
  });

  res
    .status(201)
    .json({ message: "Post have been successfully send to DB ! " });
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

exports.postDeletePage = asyncHandler(async (req, res, next) => {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return res.status(200).json({ message: "Post is successfully deleted!" });
});

exports.postUpdatePostPage = asyncHandler(async (req, res, next) => {
  const { postId } = req.query;
  const { title, content } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }
  if (!title && !content) {
    return res
      .status(400)
      .json({ message: "Title or content must be provided." });
  }

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title: title,
      content: content,
    },
  });

  return res.status(200).json({ message: "Post is successfully updated." });
});
