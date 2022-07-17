const {
  bubbleWarn,
} = require("./logger");

const { deleteWorkflowFolder } = require("./fs")

const deleteLocalFiles = async () => {
  bubbleWarn("Deleting workflow files...");
  await deleteWorkflowFolder();
}

module.exports = { deleteLocalFiles }