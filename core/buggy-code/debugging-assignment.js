const express = require("express");

const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" },
];

const notes = [
  {
    id: 1,
    title: "Note 1",
    content: "Content 1",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Note 2",
    content: "Content 2",
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).send(user);
});

function getUserById(id) {
  return users.find((u) => u.id === id);
}

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  if (!name) {
    return res.status(400).send({
      success: false,
      message: "Name is required",
    });
  }

  user.name = name;

  res.status(200).send({
    success: true,
    data: user,
  });
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).send(user);
});

app.get("/notes/count", (req, res) => {
  const total = notes.length;

  res.status(200).send({ total });
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    return res.status(200).send({
      success: true,
      message: "No notes found",
      data: [],
    });
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  res.status(200).send(sortedNotes);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).send({
      success: false,
      message: "Note not found",
    });
  }

  res.status(200).send(note);
});

function generateNoteId() {
  return Date.now();
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.status(400).send({
      success: false,
      message: "Title and content are required",
    });
  }

  const user = getUserById(Number(userId));

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  const newNote = {
    id: generateNoteId(),
    title,
    content,
    userId: Number(userId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  notes.push(newNote);

  res.status(201).send({
    success: true,
    data: newNote,
  });
});

app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  const { title, content } = req.body;

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).send({
      success: false,
      message: "Note not found",
    });
  }

  if (!title || !content) {
    return res.status(400).send({
      success: false,
      message: "Title and content are required",
    });
  }

  note.title = title;
  note.content = content;
  note.updatedAt = new Date();

  res.status(200).send({
    success: true,
    data: note,
  });
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send({
      success: false,
      message: "Note not found",
    });
  }

  notes.splice(noteIndex, 1);

  res.status(200).send({
    success: true,
    message: "Note deleted successfully",
  });
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const userNotes = notes.filter((n) => n.userId === userId);

  res.status(200).send(userNotes);
});

app.get("/search-notes", (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.status(400).send({
      success: false,
      message: "Search query is required",
    });
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query),
  );

  res.status(200).send(filteredNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    return res.status(200).send({
      success: true,
      message: "Login successful",
    });
  }

  res.status(401).send({
    success: false,
    message: "Invalid credentials",
  });
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;

  const total = Number(a) + Number(b);

  res.status(200).send({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
