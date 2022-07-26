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
      const choices = apps.map((app) => app.commit_message);
      choices.push('Cancel');

      const selectList = {
        choices,
        type: 'select',
        name: 'choiceSelected',
        message: 'Select a preview app bubble to go to its url',
      };

      const result = await prompts(selectList);
      const choice = choices[result.choiceSelected];

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
