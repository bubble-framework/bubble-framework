import open from 'open';
import prompts from 'prompts';

import getExistingApps from '../util/getExistingApps.js';
import { bubbleWarn } from '../util/logger.js';
import { NO_BUBBLES_MSG, commandsOutOfOrder } from '../util/messages.js';
import { existingAwsUser } from '../util/deleteUser.js';

const list = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    const apps = await getExistingApps();
    if (apps.length > 0) {
      const commitMessages = apps.map((app) => app.commit_message);
      commitMessages.push("Cancel");
      const selectList = {
        type: 'select',
        name: 'commitMessage',
        message: 'Select a preview app bubble to go to its url',
        choices: commitMessages,
      };

      const result = await prompts(selectList);
      const choice = commitMessages[result.commitMessage];
      if (choice === 'Cancel') {
        return;
      }
      const domain = apps.find((app) => app.commit_message === choice).url;
      open(domain);
    } else {
      bubbleWarn(NO_BUBBLES_MSG);
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('list'));
  }
};

export default list;
