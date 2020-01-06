import { CoreError, isCoreError, EventError, isEventError } from '../error.model';

describe('Error model', () => {

  beforeEach(() => {
    jest.spyOn(Error, 'captureStackTrace');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('#CoreError creates error object', () => {
    // given
    const stackTraceFactory = jest.fn();
    const error = new CoreError('test-message', {
      context: {},
      stackTraceFactory,
    });

    // when
    if (!Error.prepareStackTrace) {
      return fail('Error.prepareStackTrace is not defined');
    }

    Error.prepareStackTrace(error, []);

    // then
    expect(error.name).toBe('CoreError');
    expect(error.message).toBe('test-message');
    expect(Error.captureStackTrace).toHaveBeenCalled();
    expect(stackTraceFactory).toHaveBeenCalledWith('test-message', []);

    return;
  });

  test('#isCoreError detects CoreError type', () => {
    const coreError = new CoreError('test-message', {
      context: {},
      stackTraceFactory: jest.fn(),
    });
    const otherError = new Error();

    expect(isCoreError(coreError)).toBe(true);
    expect(isCoreError(otherError)).toBe(false);
  });

  test('#isEventError detects EventError type', () => {
    const eventError = new EventError({ type: 'TEST', }, 'test-message', {});
    const otherError = new Error();

    expect(isEventError(eventError)).toBe(true);
    expect(isEventError(otherError)).toBe(false);
  });
});
