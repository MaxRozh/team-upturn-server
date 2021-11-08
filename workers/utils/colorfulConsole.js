const colorfulConsole = ({ message, isInfo, isWarn, hasEndLine, hasStartLine }) => {
  if (hasStartLine) console.log('\n');
  if (isInfo) console.log('\x1b[36m%s\x1b[0m', message);
  if (isWarn) console.log('\x1b[33m%s\x1b[0m', message);
  if (!isInfo && !isWarn) console.log(message);
  if (hasEndLine) console.log('\n');
};

module.exports = colorfulConsole;
