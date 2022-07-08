const fs = require("fs");
const path = require("path");
const escape = "\x1b";
const reset = "\x1b[0m";
const red = "[31m";
const yellow = "[33m";
const green = "[32m";
const help = "[1;36m";

const bubbleSuccess = (successText, text) => {
  console.log(`${text}${escape}${green}`, successText, reset);
};

const bubbleErr = (text) => {
  console.log(`Error ${escape}${red}`, text, reset);
};

const bubbleWarn = (text) => {
  console.log(`${escape}${yellow}`, text, reset);
};

module.exports = {
  bubbleSuccess,
  bubbleErr,
  bubbleWarn
};