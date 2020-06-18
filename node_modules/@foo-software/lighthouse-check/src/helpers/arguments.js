import meow from 'meow';

// we should note that these values are expected from the command
// line and that they're always strings.
export const convertOptionsFromArguments = options => {
  const cli = meow();

  return Object.keys(options).reduce((accumulator, current) => {
    // get the argument value
    const argumentValue = cli.flags[current];
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
    if (option.type === 'array' && typeof value === 'string') {
      value = value.split(',');
    }

    // format object
    if (option.type === 'object' && value) {
      value = JSON.parse(value);
    }

    if (
      (option.type === 'string' && !value) ||
      (option.type !== 'boolean' && typeof value === 'boolean')
    ) {
      value = undefined;
    }

    return {
      ...accumulator,
      [current]: value
    };
  }, {});
};
