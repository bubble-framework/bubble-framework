const {
  bubbleWarn,
} = require("./logger");

const { deleteWorkflowFolder } = require("./fs")

const deleteLocalFiles = () => {
  bubbleWarn("Now deleting workflow files...");
  deleteWorkflowFolder();
}

module.exports = { deleteLocalFiles }