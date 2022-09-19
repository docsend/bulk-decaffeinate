import { exec } from 'mz/child_process';

import runWithProgressBar from '../runner/runWithProgressBar';

export default async function runPrettierFix(jsFiles, config) {
  await runWithProgressBar(
    config,
    'Running prettier --write on all files...', jsFiles, makePrettierFixFn(config));
}

function makePrettierFixFn(config) {
  return async function runEslint(path) {
    await exec(`${config.prettierPath} --write ${path}`, {maxBuffer: 10000*1024});


    return {error: null};
  };
}
