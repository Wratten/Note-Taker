const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const dbPath = path.join(__dirname, "..", "db", "db.json");

/**
 *
 * @returns {Array}
 */

function getNotes() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8") || []);
}

function saveNotes(notes) {
  fs.writeFileSync(dbPath, JSON.stringify(notes), "utf-8");
}

// get the notes
router.get("/notes", (req, res) => {
  const notes = getNotes();

  console.log(notes);

  res.json(notes);
});

// show the notes on the page
router.post("/notes", (req, res) => {
  // get the req body
  const { title, text } = req.body;

  console.log(title, text);

  // create new note in db json
  const newNote = {
    id: uuid.v4(),
    title,
    text,
  };

  // get all existing notes in db json
  const existingNotes = getNotes();

  // add this new note to the existing
  existingNotes.push(newNote);

  // resave
  fs.writeFileSync(dbPath, JSON.stringify(existingNotes), "utf-8");

  // send back response to client with new note
  res.json(newNote);
});

router.delete("/notes/:id", (req, res) => {
  //get existing notes
  const notes = getNotes();

  // get rid of target note with given id
  const filtered = notes.filter((note) => note.id !== req.params.id);

  // resave
  saveNotes(filtered);

  // send back response
  res.json({
    data: "ok",
  });
});

module.exports = router;
