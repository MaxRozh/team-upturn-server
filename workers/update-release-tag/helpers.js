/* eslint-disable @typescript-eslint/no-var-requires */

const colorfulConsole = require('../utils/colorfulConsole');

const ANSWERS = {
  major: 'major',
  minor: 'minor',
  patch: 'patch',
  no_matching: 'no_matching'
};

const getLastVersionInObject = (lastTags) => {
  let lastVersion;

  lastTags.forEach((item) => {
    if (item) {
      lastVersion = item;
    }
  });

  if (!lastVersion) {
    colorfulConsole({ message: "Can't find last version", isWarn: true });
    return null;
  }

  const lastVersionInArr = lastVersion.split('.');

  return {
    original: lastVersion,
    major: lastVersionInArr[0].replace('v', ''),
    minor: lastVersionInArr[1],
    patch: lastVersionInArr[2]
  };
};
const increaseVersion = (versionInObj, { isMajor, isMinor, isPatch }) => {
  const { original, major, minor, patch } = versionInObj;

  if (isMajor) return `v${[+major + 1, 0, 0].join('.')}`;
  if (isMinor) return `v${[major, +minor + 1, 0].join('.')}`;
  if (isPatch) return `v${[major, minor, +patch + 1].join('.')}`;
  return original;
};
const validateVersion = (version) => {
  if (!version) return false;

  const [major, minor, patch] = version.split('.');

  if (!major || !minor || !patch) return false;

  if (major.indexOf('v') === -1 || !Number.isInteger(+major.replace('v', ''))) {
    return false;
  }
  if (!Number.isInteger(+minor)) return false;
  if (!Number.isInteger(+patch)) return false;

  return true;
};

module.exports = {
  ANSWERS,
  getLastVersionInObject,
  increaseVersion,
  validateVersion
};
