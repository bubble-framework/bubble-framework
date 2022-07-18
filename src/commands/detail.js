import getExistingApps from '../util/getExistingApps';
import existingAwsUser from '../util/deleteUser';

import outputTableFromArray from '../util/consoleMessage';
import { bubbleGeneral, bubbleWarn } from '../util/logger';

import {
  SHORT_NO_BUBBLES_MSG,
  DETAIL_INTRO_MSG,
  commandsOutOfOrder,
} from '../util/messages';

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
