// File System
const name = require("./utils");
const validator = require("validator");
const chalk = require("chalk");
const yargs = require("yargs");
const { addNote, removeNote, listNote, readNote } = require("./notes");

// Customizing Yargs Version
yargs.version("1.1.0");

// Create Add Command
yargs.command({
  command: "add",
  description: "Add a new Note",
  builder: {
    title: {
      description: "Note Title",
      demandOption: true,
      type: "string",
    },
    body: {
      description: "Note Body",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    addNote(argv.title, argv.body);
  },
});

// Create Remove Command
yargs.command({
  command: "remove",
  description: "Remove a new Note",
  builder: {
    title: {
      description: "Note Title",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    removeNote(argv.title);
  },
});

// Create Read Command
yargs.command({
  command: "read",
  description: "Read a new Note",
  builder: {
    title: {
      description: "Note Title",
      demandOption: true,
      type: "string",
    },
  },
  handler: (argv) => {
    readNote(argv.title);
  },
});

// Create List Command
yargs.command({
  command: "list",
  description: "List Notes",
  handler: () => {
    listNote()
  },
});

// console.log(yargs.argv)
yargs.parse();
