import axios from 'axios';

import { bubbleGeneral, bubbleErr, bubbleSuccess } from './logger.js';
import { getPublicKey } from '../services/githubService.js';
import { getRepoInfo, GH_HEADER_OBJ } from '../constants.js';

async function deleteGithubSecrets() {
  await getPublicKey();

  bubbleSuccess('retrieved', 'Public key:');

  const secrets = [
    'BUBBLE_AWS_ACCESS_KEY_ID',
    'BUBBLE_AWS_SECRET_ACCESS_KEY',
    'BUBBLE_GITHUB_TOKEN',
  ];

  secrets.forEach(async (secretName) => {
    const { owner, repo } = await getRepoInfo();
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`;

    bubbleGeneral(`Removing ${secretName} secret from your Github repository...`);

    try {
      await axios.delete(url, GH_HEADER_OBJ);
      bubbleSuccess('removed', `${secretName} secret has been:`);
    } catch (e) {
      bubbleErr(`Oops! Could not remove ${secretName}. Try re-running \`bubble teardown\` and double check your Github repository if you'd like to ensure all secrets prepended with \`BUBBLE\` have been removed.`);
    }
  });
}

export default deleteGithubSecrets;
