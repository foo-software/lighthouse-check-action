// if the value is assigned as an argument get that... otherwise `undefined`
export const getArgument = name => {
  const index = process.argv.indexOf(`--${name}`);

  if (index < 0) {
    return undefined;
  }

  // if our flag is the last `argv` or the one after has a flag
  // assume the value should be `true`
  if (
    index === process.argv.length - 1 ||
    process.argv[index + 1].includes('--')
  ) {
    return true;
  }

  return process.argv[index + 1];
};

export const convertOptionsFromArguments = options =>
  Object.keys(options).reduce((accumulator, current) => {
    // get the argument value
    const argumentValue = getArgument(current);

    // if the value doesn't exist from an argument, use the existing option / value
    let value =
      typeof argumentValue !== 'undefined' ? argumentValue : options[current];

    // convert string boolean to boolean
    if (typeof value === 'string') {
      const lowerCaseValue = value.toLowerCase();
      if (lowerCaseValue === 'true') {
        value = true;
      } else if (lowerCaseValue === 'false') {
        value = false;
      }
    }

    return {
      ...accumulator,
      [current]: value
    };
  }, {});
