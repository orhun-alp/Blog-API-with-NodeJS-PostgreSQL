const asyncHandler = require("express-async-handler");
const pool = require("../db.js");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

// Comment Controllers
const createComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;
    const postId = req.params.postId;

    const result = await pool.query(
      "INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [content, userId, postId]
    );

    const comment = result.rows[0];
    res.json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const commentId = req.params.id;

    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const updateComment = asyncHandler(async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;

    await pool.query("UPDATE comments SET content = $1 WHERE id = $2", [
      content,
      commentId,
    ]);

    res.json({ message: "Comment updated successfully" });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User's own posts and comments controllers
const myPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const myComments = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT * FROM comments WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user's comments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get posts by category and title controllers
const postByCategory = asyncHandler(async (req, res) => {
  try {
    const category = req.params.category;

    const result = await pool.query(
      "SELECT * FROM posts WHERE category = $1 ORDER BY created_at DESC",
      [category]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts by category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const postByTitle = asyncHandler(async (req, res) => {
  try {
    const title = req.query.title;

    const result = await pool.query(
      "SELECT * FROM posts WHERE title ILIKE $1 ORDER BY created_at DESC",
      [`%${title}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error searching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST CRUD Controllers
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const getNPosts = asyncHandler(async (req, res) => {
  try {
    const count = req.params.count;

    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1",
      [count]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching last posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const getPostDetails = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;

    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postResult.rows[0];

    const commentsResult = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
      [postId]
    );

    const postWithComments = {
      ...post,
      comments: commentsResult.rows,
    };

    res.json(postWithComments);
  } catch (err) {
    console.error("Error fetching post details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const createPost = asyncHandler(async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      "INSERT INTO posts (title, content, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, category, userId]
    );

    const post = result.rows[0];
    res.json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const updatePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;

    await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
      [title, content, postId]
    );

    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const deletePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;

    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
    await pool.query("DELETE FROM comments WHERE post_id = $1", [postId]);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  myPosts,
  myComments,
  postByCategory,
  postByTitle,
  getAllPosts,
  getNPosts,
  getPostDetails,
  createPost,
  updatePost,
  deletePost,
};
