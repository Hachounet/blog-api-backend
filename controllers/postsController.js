const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  console.log("All posts page");
  try {
    const allPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
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

    if (!allPosts) {
      const error = new Error("All posts not found.");
      error.statusCode = 404;
      throw error;
    }
    res.json(allPosts);
  } catch (err) {
    next(err);
  }
});

exports.getSpecificPostPage = asyncHandler(async (req, res, next) => {
  async function fetchCommentsWithChildren(commentId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        Children: true, // Include all children of this comment
        author: {
          select: {
            pseudo: true,
          },
        },
        _count: {
          // Get the count of likes
          select: {
            Like: true,
          },
        },
        Likes: req.user.id
          ? {
              // Check if the current user liked this comment only if the user is logged in
              where: {
                userId: req.user.id,
              },
              select: {
                id: true,
              },
            }
          : false, // If the user is not logged in, we skip fetching Likes
      },
    });

    // If the comment is not found, return null
    if (!comment) {
      return null; // Or throw an error if preferred
    }

    // If the comment has children, call this function recursively on each child
    if (comment.Children.length > 0) {
      comment.Children = await Promise.all(
        comment.Children.map((child) => fetchCommentsWithChildren(child.id)),
      );
    }

    return comment;
  }

  const potentialUser = req.user?.id || "unlogged"; // Handle potential undefined user ID

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.postId,
        authorized: true,
      },
      include: {
        _count: {
          select: {
            Like: true,
          },
        },
        author: {
          select: {
            pseudo: true,
          },
        },
        Likes: req.user.id
          ? {
              // Fetch Likes only if the user is logged in
              where: {
                userId: req.user.id,
              },
              select: {
                id: true,
              },
            }
          : false, // If not logged in, skip fetching Likes
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
    });

    // Retrieve children recursively for each root comment
    const commentsWithChildren = await Promise.all(
      comments.map((comment) => fetchCommentsWithChildren(comment.id)),
    );

    // Filter out any null comments (in case any weren't found)
    const filteredCommentsWithChildren = commentsWithChildren.filter(
      (comment) => comment !== null,
    );

    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
        published: true,
      },
      include: {
        author: {
          select: {
            pseudo: true,
          },
        },
      },
    });

    if (!post) {
      const error = new Error("Post not found.");
      error.statusCode = 404;
      throw error;
    }

    res.json({ ...post, comments: filteredCommentsWithChildren });
  } catch (err) {
    next(err);
  }
});

exports.getSpecificPostPageComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 0;
  const limit = 10;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.postId,
        authorized: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: page * limit,
      take: limit,
    });

    if (!comments.length) {
      return res.json({ commentsEmpty: true });
    }
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

exports.postCommentAndLikesOnSpecificPostPage = asyncHandler(
  async (req, res, next) => {
    console.log("bf");

    // Handling likes
    if (req.query.like) {
      const checkLike = await prisma.like.findUnique({
        where: {
          userId_commentId: {
            userId: req.user.id,
            commentId: req.query.commentId,
          },
        },
      });

      if (checkLike) {
        // If the like exists, remove it (unlike)
        await prisma.like.delete({
          where: {
            userId_commentId: {
              userId: req.user.id,
              commentId: req.query.commentId,
            },
          },
        });
        return res.status(200).json({ message: "Like removed." });
      } else {
        // If the like doesn't exist, create a new like
        const newLike = await prisma.like.create({
          data: {
            commentId: req.query.commentId,
            userId: req.user.id,
          },
        });

        return res
          .status(201)
          .json({ message: "Comment liked!", like: newLike });
      }
    }

    // Handling comments
    if (req.query.comment) {
      if (req.query.comment.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty." });
      }

      const commentData = {
        content: req.query.comment,
        authorId: req.user.id,
        postId: req.params.postId,
      };

      // If there's a parentComment, it means this is a reply
      if (req.query.parentComment) {
        commentData.parentId = req.query.parentComment;
      }

      const newComment = await prisma.comment.create({
        data: commentData,
      });

      return res
        .status(201)
        .json({ message: "Comment posted!", comment: newComment });
    }

    res.status(400).json({ message: "Invalid request." });
  },
);
