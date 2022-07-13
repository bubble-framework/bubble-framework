const {
  bubbleWarn,
} = require("./logger");

const { deleteWorkflowFolder } = require("./fs")

const deleteLocalFiles = () => {
  bubbleWarn("Deleting workflow files");
  deleteWorkflowFolder();
}

module.exports = { deleteLocalFiles }