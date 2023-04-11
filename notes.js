const fs = require("fs");
const chalk = require("chalk");
const { title } = require("process");

const getNotes = () => {
  return "Your Notes";
};

const addNote = (title, body) => {
  const notes = loadNotes();

  const duplicateNotes = notes.find((note) => note.title === title)

  debugger
  
  if (!duplicateNotes) {
    notes.push({
      title: title,
      body: body,
    });

    saveNotes(notes);

    console.log(chalk.green.inverse("New Note Added!"));
  } else {
    console.log(chalk.red.inverse("Note Title Taken!"));
  }
};


const readNote = (title) => {
    const notes = loadNotes()
    const note = notes.find((note) => note.title === title)

    if(note){
        console.log(chalk.inverse(note.title))
        console.log(note.body)
    }else{
        console.log(chalk.red.inverse('Note not fond!'))
    }
}

const removeNote = (title) => {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => {
    return note.title !== title;
  });

  if (notes.length > notesToKeep.length) {
    console.log(chalk.green.inverse("Note removed!"));
    saveNotes(notesToKeep);
  } else {
    console.log(chalk.red.inverse("Note not found!"));
  }
};

const listNote = () => {
    const notes = loadNotes()

    console.log(chalk.inverse('Your Notes!'))

    notes.forEach((note) => {
        console.log(note.title)
    });
}

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = { getNotes, addNote, removeNote, listNote, readNote };
