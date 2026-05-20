const Note = require("../models/Note");

// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const {
      userId,

      title,

      content,

      tags,

      pinned,
    } = req.body;

    // VALIDATION
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const note = await Note.create({
      userId,

      title,

      content,

      tags,

      pinned,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL NOTES
exports.getNotes = async (req, res) => {
  try {
    const userId = req.query.userId;

    const notes = await Note.find({
      userId,
    })

      .sort({
        pinned: -1,

        updatedAt: -1,
      });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE NOTE
exports.getSingleNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const {
      title,

      content,

      tags,

      pinned,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,

      {
        title,

        content,

        tags,

        pinned,
      },

      {
        new: true,
      },
    );

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH NOTES
exports.searchNotes = async (req, res) => {
  try {
    const q = req.query.q;

    const userId = req.query.userId;

    const notes = await Note.find({
      userId,

      $or: [
        {
          title: {
            $regex: q,

            $options: "i",
          },
        },

        {
          content: {
            $regex: q,

            $options: "i",
          },
        },

        {
          tags: {
            $regex: q,

            $options: "i",
          },
        },
      ],
    }).sort({
      pinned: -1,

      updatedAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
