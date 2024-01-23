const express = require("express");
const {
  validateCommentInput,
  validatePostInput,
  verifyToken,
} = require("../middleware/middleware");
const {
  createComment,
  deleteComment,
  updateComment,
  myPosts,
  myComments,
  postByCategory,
  getAllPosts,
  getNPosts,
  getPostDetails,
  createPost,
  updatePost,
  deletePost,
  postByTitle,
} = require("../controllers/postController.js");
const router = express.Router();

// Comment Routes
// Create comment route
router.post(
  "/:postId/comments",
  verifyToken,
  validateCommentInput,
  createComment
);
// Delete comment route
router.delete("/comments/:id", verifyToken, deleteComment);
// Update comment route
router.put("/comments/:id", verifyToken, updateComment);

// User's own posts and comments routes
// Get user's own posts route
router.get("/my-posts", verifyToken, myPosts);
// Get user's own comments route
router.get("/my-comments", verifyToken, myComments);

// Get posts by category and title routes
// Get posts by category route
router.get("/category/:category", postByCategory);
// Search posts by title route
router.get("/:title", postByTitle);

// CRUD POST routes
// Get all posts route
router.get("/", getAllPosts);
// Get last N posts route
router.get("/:count", getNPosts);
// Get post details with comments route
router.get("/:postId", getPostDetails);
// Create post route
router.post("/", verifyToken, validatePostInput, createPost);
// Update post route
router.put("/:postId", verifyToken, validatePostInput, updatePost);
// Delete post route
router.delete("/:postId", verifyToken, deletePost);

module.exports = router;
