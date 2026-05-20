const express = require("express");

const router = express.Router();

const {
  createNote,

  getNotes,

  getSingleNote,

  updateNote,

  deleteNote,

  searchNotes,
} = require("../controllers/noteController");

// SEARCH
router.get("/search", searchNotes);

// GET ALL NOTES
router.get("/", getNotes);

// GET SINGLE NOTE
router.get("/:id", getSingleNote);

// CREATE NOTE
router.post("/", createNote);

// UPDATE NOTE
router.put("/:id", updateNote);

// DELETE NOTE
router.delete("/:id", deleteNote);

module.exports = router;
