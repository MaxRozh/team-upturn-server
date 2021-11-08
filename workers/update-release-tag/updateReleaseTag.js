/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { findOutWhichVersion, getWrittenVersion, getWrittenCommitMessage } = require('./promptsForTag');
const { ANSWERS, validateVersion } = require('./helpers');
const colorfulConsole = require('../utils/colorfulConsole');
const packageJson = require('../../package.json');

const readmeFilePath = path.resolve(__dirname, '../../README.md');

colorfulConsole({ message: 'Start updating release tag', hasStartLine: true });

const tagsRes = execSync('git tag', { encoding: 'utf-8' });
const tagsInArr = tagsRes.split('\n');
const lastTags = tagsInArr.splice(tagsInArr.length - 4);

colorfulConsole({ message: '[1/5] Showing last release tags...' });
colorfulConsole({ message: lastTags.join('\n') });

(async () => {
  colorfulConsole({ message: '[2/5] Selecting version...' });

  let selectedVersion = await findOutWhichVersion(lastTags);

  if (!selectedVersion || selectedVersion === ANSWERS.no_matching) {
    selectedVersion = await getWrittenVersion();
  }

  const isValidVersion = validateVersion(selectedVersion);

  if (!isValidVersion) {
    colorfulConsole({ message: 'Version is invalid. Valid example - v1.4.7', isWarn: true });
    selectedVersion = await getWrittenVersion();

    if (!validateVersion(selectedVersion)) {
      colorfulConsole({ message: 'Version is invalid. Good bay.', isWarn: true });
      throw new Error('Invalid version');
    }
  }

  colorfulConsole({ message: '[success] Selected version', isInfo: true });
  colorfulConsole({ message: '[3/5] Writing commit message...' });

  let commitMessage = await getWrittenCommitMessage();

  if (!commitMessage) {
    colorfulConsole({ message: 'You need write commit message', isWarn: true });
    commitMessage = await getWrittenCommitMessage();

    if (!commitMessage) {
      colorfulConsole({ message: "Message wasn't written. Good bay.", isWarn: true });
      throw new Error('No commit message');
    }
  }

  colorfulConsole({ message: '[success] Wrote commit message', isInfo: true });
  colorfulConsole({ message: '[4/5] Updating Readme.md and package.json...' });

  const versionForView = selectedVersion.replace('v', '');

  const readmeData = fs.readFileSync(readmeFilePath, 'utf-8');
  const updatedReadmeData = readmeData.replace(/_\*`(.*?)`\*_/i, `_*\`${versionForView}\`*_`);
  fs.writeFileSync(readmeFilePath, updatedReadmeData);

  packageJson.version = versionForView;
  fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(packageJson, null, 2));

  colorfulConsole({ message: '[success] Updated Readme.md and package.json', isInfo: true });
  colorfulConsole({ message: '[5/5] Setting and pushing new tag version...' });

  execSync(`git tag -a ${selectedVersion} -m "${commitMessage}"`);
  execSync('git push origin --tags');

  colorfulConsole({ message: '[success] Version is updated', isInfo: true });
})();
