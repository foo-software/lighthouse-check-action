// if the value is assigned as an argument get that... otherwise `undefined`
export const getArgument = name => {
  const index = process.argv.indexOf(`--${name}`);

  if (index < 0) {
    return undefined;
  }

  // if our flag is the last `argv` or the one after has a flag
  // assume the value as an empty string
  if (
    index === process.argv.length - 1 ||
    process.argv[index + 1].includes('--')
  ) {
    return '';
  }

  return process.argv[index + 1];
};

// we should note that these values are expected from the command
// line and that they're always strings.
export const convertOptionsFromArguments = options =>
  Object.keys(options).reduce((accumulator, current) => {
    // get the argument value
    const argumentValue = getArgument(current);
    const option = options[current];

    // if the value doesn't exist from an argument, use the existing option / value
    let value =
      typeof argumentValue !== 'undefined' ? argumentValue : option.value;

    // format boolean
    if (option.type === 'boolean' && typeof value === 'string') {
      const lowerCaseValue = value.toLowerCase();

      // convert string boolean to boolean
      if (lowerCaseValue === 'true') {
        value = true;
      } else if (lowerCaseValue === 'false') {
        value = false;
      } else if (lowerCaseValue === '') {
        // if we received an argument as a flag
        value = true;
      }
    }

    // format number
    if (option.type === 'number' && typeof value !== 'number') {
      value = Number(value);
    }

    // format array
    if (option.type === 'array' && value) {
      value = value.split(',');
    }

    if (option.type === 'string' && !value) {
      value = undefined;
    }

    return {
      ...accumulator,
      [current]: value
    };
  }, {});
