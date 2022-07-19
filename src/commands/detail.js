import getExistingApps from '../util/getExistingApps.js';
import existingAwsUser from '../util/deleteUser.js';

import outputTableFromArray from '../util/consoleMessage.js';
import { bubbleGeneral, bubbleWarn } from '../util/logger.js';

import {
  SHORT_NO_BUBBLES_MSG,
  DETAIL_INTRO_MSG,
  commandsOutOfOrder,
} from '../util/messages.js';

const detail = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    bubbleGeneral(DETAIL_INTRO_MSG);

    const apps = await getExistingApps();

    if (apps.length === 0) {
      apps.push(SHORT_NO_BUBBLES_MSG);
    }
    outputTableFromArray(apps);
  } catch {
    bubbleWarn(commandsOutOfOrder('detail'));
  }
};

export default detail;
