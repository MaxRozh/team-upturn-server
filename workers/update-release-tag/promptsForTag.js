/* eslint-disable @typescript-eslint/no-var-requires */

const prompts = require('prompts');

const { ANSWERS, getLastVersionInObject, increaseVersion } = require('./helpers');

const findOutWhichVersion = async (lastTags) => {
  const lastVersion = getLastVersionInObject(lastTags);

  if (!lastVersion) return null;

  const increasedMajor = increaseVersion(lastVersion, { isMajor: true });
  const increasedMinor = increaseVersion(lastVersion, { isMinor: true });
  const increasedPatch = increaseVersion(lastVersion, { isPatch: true });

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select which version next',
    choices: [
      { title: `[major] ${increasedMajor}`, value: increasedMajor },
      { title: `[minor] ${increasedMinor}`, value: increasedMinor },
      { title: `[patch] ${increasedPatch}`, value: increasedPatch },
      { title: 'No matching answers', value: ANSWERS.no_matching }
    ],
    initial: 1
  });

  return response.value;
};

const getWrittenVersion = async () => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'Write version',
    initial: ''
  });

  return response.value;
};

const getWrittenCommitMessage = async () => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'Write commit message. Example: 13.08.2021 web-sprint #87',
    initial: ''
  });

  return response.value;
};

module.exports = {
  findOutWhichVersion,
  getWrittenVersion,
  getWrittenCommitMessage
};
