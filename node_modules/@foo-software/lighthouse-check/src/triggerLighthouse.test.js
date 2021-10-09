import fetch from 'node-fetch';
import triggerLighthouse from './triggerLighthouse';

const mockResponse = {
  status: 200,
  data: {}
};

const mockPageResponse = {
  ...mockResponse,
  data: {
    page: []
  }
};

const mockFetchPagesResponse = {
  json: () => ({
    ...mockPageResponse,
    data: {
      page: [
        {
          _id: 'abc',
          apiToken: 'abc123'
        },
        {
          _id: 'def',
          apiToken: 'def456'
        }
      ]
    }
  })
};

const mockFetchPagesEmptyResponse = {
  json: () => mockPageResponse
};

const mockFetchPagesUnauthorizedResponse = {
  json: () => ({
    status: 401
  })
};

const mockQueueItemsResponse = {
  ...mockResponse,
  data: {
    queue: {
      results: [],
      errors: 0
    }
  }
};

const mockFetchQueueItemsEmptyResponse = {
  json: () => ({
    ...mockQueueItemsResponse
  })
};

const mockFetchQueueItemsSuccessResponse = {
  json: () => ({
    ...mockQueueItemsResponse,
    data: {
      queue: {
        ...mockQueueItemsResponse.data.queue,
        results: [
          {
            code: 'SUCCESS_QUEUE_ADD',
            status: 200
          },
          {
            code: 'SUCCESS_QUEUE_ADD',
            status: 200
          }
        ]
      }
    }
  })
};

const mockFetchQueueItemsFailResponse = {
  json: () => ({
    ...mockQueueItemsResponse,
    data: {
      queue: {
        ...mockQueueItemsResponse.data.queue,
        results: [
          {
            code: 'SOME_ERROR',
            message: 'some error message',
            status: 401
          },
          {
            code: 'SOME_ERROR',
            message: 'some error message',
            status: 401
          }
        ],
        errors: 2
      }
    }
  })
};

const mockFetchQueueItemsFailMaxReachedResponse = {
  json: () => ({
    ...mockQueueItemsResponse,
    data: {
      queue: {
        ...mockQueueItemsResponse.data.queue,
        results: [
          {
            code: 'ERROR_QUEUE_MAX_USED_DAY',
            message: 'Max limit of 5 triggers reached.',
            status: 401
          },
          {
            code: 'ERROR_QUEUE_MAX_USED_DAY',
            message: 'Max limit of 5 triggers reached.',
            status: 401
          }
        ],
        errors: 2
      }
    }
  })
};

const mockFetchQueueItemsMixedResponse = {
  json: () => ({
    ...mockQueueItemsResponse,
    data: {
      queue: {
        ...mockQueueItemsResponse.data.queue,
        results: [
          {
            code: 'ERROR_QUEUE_MAX_USED_DAY',
            message: 'Max limit of 5 triggers reached.',
            status: 401
          },
          {
            code: 'ERROR_QUEUE_MAX_USED_DAY',
            message: 'Max limit of 5 triggers reached.',
            status: 401
          },
          {
            code: 'SUCCESS_QUEUE_ADD',
            status: 200
          }
        ],
        errors: 2
      }
    }
  })
};

const mockParams = {
  apiToken: 'abc123'
};

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('triggerLighthouse()', () => {
  describe('on success', () => {
    it('should return an expected response payload', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesResponse)
        .mockReturnValueOnce(mockFetchQueueItemsSuccessResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });

    it('should return an expected response payload when some URLs failed to queue but some succeeded', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesResponse)
        .mockReturnValueOnce(mockFetchQueueItemsMixedResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });
  });

  describe('on fail', () => {
    it('should return an expected response payload when api key is invalid', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesUnauthorizedResponse)
        .mockReturnValueOnce(mockFetchQueueItemsSuccessResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });

    it('should return an expected response payload when no pages are found', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesEmptyResponse)
        .mockReturnValueOnce(mockFetchQueueItemsSuccessResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });

    it('should return an expected response payload when no queue results are returned', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesResponse)
        .mockReturnValueOnce(mockFetchQueueItemsEmptyResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });

    it('should return an expected response payload when all URLs failed to queue', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesResponse)
        .mockReturnValueOnce(mockFetchQueueItemsFailResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });

    it('should return an expected response payload when all URLs failed to queue due to max limit reached', async () => {
      fetch
        .mockReset()
        .mockReturnValueOnce(mockFetchPagesResponse)
        .mockReturnValueOnce(mockFetchQueueItemsFailMaxReachedResponse);

      const response = await triggerLighthouse(mockParams);
      expect(response).toMatchSnapshot();
    });
  });
});
