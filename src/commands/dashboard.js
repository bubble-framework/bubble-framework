import childProcess from 'child_process';

import {
  bubbleGeneral,
  bubbleErr,
  bubbleWarn,
  bubbleConclusionSecondary,
} from '../util/logger.js';

import { bubbleDashboardServerFolderPath, activeReposPath } from '../util/paths.js';
import { existingAwsUser } from '../util/deleteUser.js';

import {
  DASHBOARD_STARTUP_MSG,
  RUN_FROM_NONBUBBLE_MSG,
  dashboardUrlMessage,
  commandsOutOfOrder,
} from '../util/messages.js';

import { getRepoInfo } from '../constants.js';
import net from 'net';
import { createServer } from 'net';
import axios from 'axios';
import { readConfigFile } from '../util/fs.js';

// const isPortTaken = (port) => {
//   let hasError = 0;
//   return new Promise((res) => {
//     const server = createServer()
//       .once('error', err => { if (err) { res(false) } })
//       .once('listening', () => {
//         server
//           .once('close', () => {
//             hasError++;
//             if (hasError > 1) {
//               res(false)
//             } else {
//               res(true)
//             }
//           })
//           .close()
//       })
//       .listen(port)
//   })
// };

// const isPortTaken = (port, fn) => {
//   var tester = net.createServer()
//   .once('error', function (err) {
//     if (err.code != 'EADDRINUSE') return fn(err)
//     fn(null, true)
//   })
//   .once('listening', function() {
//     tester.once('close', function() { fn(null, false) })
//     .close()
//   })
//   .listen(port)
// };

const isActiveRepo = (activeRepos, currentRepoName) => {
  return activeRepos.some(({repoName}) => repoName === currentRepoName);
}

const dashboard = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    const { repo } = await getRepoInfo();

    const activeRepos = readConfigFile(activeReposPath, 'JSON');
    if (!isActiveRepo(activeRepos, repo)) {
      bubbleErr(RUN_FROM_NONBUBBLE_MSG);
      return;
    }

    try {
      bubbleGeneral(DASHBOARD_STARTUP_MSG);
      // const result = axios.get(`http://localhost:3000/${repo}`);
      // console.log(result.status);

      const childResult = childProcess.spawn(
        'npm',
        ['run', 'dashboard'],
        { cwd: bubbleDashboardServerFolderPath },
      );

      childResult.stdout.on('data', async (data) => {
        console.log(`stdout: ${data}`);
        if (data.includes('You can now view bubble-dashboard in the browser')) {
          bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
        }

      //     const taken = await isPortTaken(3000);
      //     if (taken) {
      //       console.log('taken')
      //     } else {
      //       console.log('not taken')
      //     }
          // setTimeout(async () => {
          //   const taken = await isPortTaken(3000);
          //   if (taken) {
          //     console.log('taken')
          //   } else {
          //     console.log('not taken')
          //   }
            // const server = net.createServer();

            // server.listen(3000, () => {
            //   server.once('error', err => {
            //     if (err.code === 'EADDRINUSE') {
            //       console.log('port in use')
            //       server.close();
            //     }
            //   })
            // });

            // server.once('error', function(err) {
            //   if (err.code === 'EADDRINUSE') {
            //     console.log('port in use')
            //     server.close();
            //   }
            // });

            // server.close(() => {
            //   console.log('closed')
            // })

            // server.once('listening', function() {
            //   console.log('closing');
            //   server.close();
            //   return;
            // });

            // server.listen(3000);
          // }, 10000)
          // const server = net.createServer();

          // server.once('error', function(err) {
          //   if (err.code === 'EADDRINUSE') {
          //     console.log('port in use')
          //     server.close();
          //   }
          // });

          // // server.once('listening', function() {
          // //   console.log('closing');
          // //   server.close();
          // //   return;
          // // });

          // server.listen(3000);
        // }
      });

      setTimeout(async () => {
        try {
          const result = await axios.get(`http://localhost:3000`);

          if (result.status === 200) {
            bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
          }
        } catch(err) {
          throw new Error('this is an error');
          // bubbleErr(`Could not start up dashboard due to: ${err}!`);
          // console.log(err.response.status)
        }

      }, 15000)
    } catch (err) {
      bubbleErr(`Could not start up dashboard due to: ${err}!`);
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('dashboard'));
  }
};

export default dashboard;
