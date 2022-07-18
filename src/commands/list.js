import open from 'open';
import prompts from 'prompts';

import getExistingApps from '../util/getExistingApps';
import { bubbleWarn } from '../util/logger';
import { NO_BUBBLES_MSG, commandsOutOfOrder } from '../util/messages';
import { existingAwsUser } from '../util/deleteUser';

const list = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    const apps = await getExistingApps();
    if (apps.length > 0) {
      const commitMessages = apps.map((app) => app.commit_message);
      const selectList = {
        type: 'select',
        name: 'commitMessage',
        message: 'Select a preview app bubble to go to its url',
        choices: commitMessages,
      };

      const result = await prompts(selectList);
      const choice = commitMessages[result.commitMessage];

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
