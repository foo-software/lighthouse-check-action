import { getArgument, convertOptionsFromArguments } from './arguments';

describe('getArgument', () => {
  const ARGV = process.argv;

  beforeEach(() => {
    // clear the cache
    jest.resetModules();
    process.argv = ['--ipsum', 'lorem', '--hello', 'world', '--foo', 'bar'];
  });

  afterEach(() => {
    process.argv = ARGV;
  });

  it('should return the correct value of a command argument', () => {
    const expected = 'world';
    const actual = getArgument('hello');
    expect(actual).toEqual(expected);
  });

  it('should return undefined of a non-existent command argument', () => {
    const expected = undefined;
    const actual = getArgument('non-existent');
    expect(actual).toEqual(expected);
  });

  it('should return "" from a flag without a value', () => {
    process.argv = ['--ipsum', 'lorem', '--without-a-value', '--foo', 'bar'];
    const expected = '';
    const actual = getArgument('without-a-value');
    expect(actual).toEqual(expected);
  });

  it('should return "" of a flag without a value an at the end of a command.', () => {
    process.argv.push('--without-a-value');
    const expected = '';
    const actual = getArgument('without-a-value');
    expect(actual).toEqual(expected);
  });
});

describe('convertOptionsFromArguments', () => {
  const ARGV = process.argv;

  beforeEach(() => {
    // clear the cache
    jest.resetModules();
    process.argv = ['--ipsum', 'lorem', '--hello', 'world', '--foo', 'bar'];
  });

  afterEach(() => {
    process.argv = ARGV;
  });

  it('should use default values when arguments are non-existent', () => {
    const expected = {
      nonexistent: 'lorem',
      nonexistent2: false
    };
    const actual = convertOptionsFromArguments({
      nonexistent: {
        type: 'string',
        value: 'lorem'
      },
      nonexistent2: {
        type: 'boolean',
        value: false
      }
    });
    expect(actual).toEqual(expected);
  });

  it('should override options from arguments', () => {
    const expected = {
      ipsum: 'lorem',
      another: 'one',
      hello: 'world'
    };
    const actual = convertOptionsFromArguments({
      ipsum: {
        type: 'string',
        value: 'foobar'
      },
      another: {
        type: 'string',
        value: 'one'
      },
      hello: {
        type: 'string',
        value: 'something'
      }
    });
    expect(actual).toEqual(expected);
  });

  it('should create correct types from CLI string argument', () => {
    const options = convertOptionsFromArguments({
      myEmptyString: {
        type: 'string',
        value: ''
      },
      myString: {
        type: 'string',
        value: 'foobar'
      },
      myBoolean: {
        type: 'boolean',
        value: 'true'
      },
      myBooleanFalse: {
        type: 'boolean',
        value: 'false'
      },
      myBooleanEmpty: {
        type: 'boolean',
        value: ''
      },
      myNumber: {
        type: 'number',
        value: '100'
      },
      myArray: {
        type: 'array',
        value: 'one,two'
      }
    });

    expect(typeof options.myEmptyString).toEqual('undefined');
    expect(options.myString).toEqual('foobar');
    expect(options.myBoolean).toEqual(true);
    expect(options.myBooleanFalse).toEqual(false);

    // the CLI argument present with no arguments is interpretted as `true`
    expect(options.myBooleanEmpty).toEqual(true);

    expect(options.myNumber).toEqual(100);
    expect(options.myArray).toEqual(['one', 'two']);
  });
});
