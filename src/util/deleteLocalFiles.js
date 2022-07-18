const {
  bubbleGeneral,
} = require("./logger");

const { deleteWorkflowFolder } = require("./fs")

const deleteLocalFiles = async () => {
  bubbleGeneral("Deleting workflow files...");
  await deleteWorkflowFolder();
}

module.exports = { deleteLocalFiles }