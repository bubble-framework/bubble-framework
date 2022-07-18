import { bubbleGeneral } from './logger';
import { deleteWorkflowFolder } from './fs';

const deleteLocalFiles = async () => {
  bubbleGeneral('Deleting workflow files...');
  await deleteWorkflowFolder();
};

export default { deleteLocalFiles };
