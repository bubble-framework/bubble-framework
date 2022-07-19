import { Console } from 'console';
import { Transform } from 'stream';

function outputTableFromArray(input) {
  const ts = new Transform({
    transform: (chunk, _enc, cb) => cb(null, chunk),
  });

  const logger = new Console({ stdout: ts });

  logger.table(input);
  const table = (ts.read() || '').toString();

  let result = '';

  table.split(/[\r\n]+/).forEach((row) => {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  });

  console.log(result);
}

export default outputTableFromArray;
