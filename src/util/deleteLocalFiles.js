import { bubbleGeneral } from './logger.js';
import { deleteWorkflowFolder } from './fs.js';

const deleteLocalFiles = async () => {
  bubbleGeneral('Deleting workflow files...');
  await deleteWorkflowFolder();
};

export default deleteLocalFiles;
