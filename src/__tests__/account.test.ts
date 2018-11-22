jest.mock('node-fetch', () => jest.fn(() => Promise.resolve()));
const fetch = require.requireMock('node-fetch');
const { Response } = require.requireActual('node-fetch');

import {
  generateAccessToken,
  getBaseInfo,
  getBlockStatus,
  getBlocks,
  createBlock,
  deleteBlock,
  getImages,
  getGalleryFavorites,
  getFavorites,
  OAUTH2_TOKEN_ENDPOINT,
  ACCOUNT_ENDPOINT,
  BLOCK_STATUS_ENDPOINT,
  BLOCKS_ENDPOINT,
  BLOCK_CREATE_DELETE_ENDPOINT,
  IMAGES_ENDPOINT,
  GALLERY_FAVORITES_ENDPOINT,
  FAVORITES_ENDPOINT,
} from '../account';

import { URLSearchParams } from 'url';

afterEach(() => {
  fetch.mockReset();
});

describe('getAccessToken tests', () => {
  test('getAccessToken calls the correct endpoint and resolves', async () => {
    const credentials = {
      refreshToken: 'myRefreshToken',
      clientId: 'myId',
      clientSecret: 'mySecret',
    };

    const mockResponse = JSON.stringify(
      require('../__fixtures__/generateAccessTokenResponse.json'),
    );
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedParams = new URLSearchParams();
    expectedParams.append('refresh_token', credentials.refreshToken);
    expectedParams.append('client_id', credentials.clientId);
    expectedParams.append('client_secret', credentials.clientSecret);
    expectedParams.append('grant_type', 'refresh_token');

    await expect(generateAccessToken(credentials)).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(OAUTH2_TOKEN_ENDPOINT, {
      body: expectedParams,
      method: 'POST',
    });
  });
});

describe('getBaseInfo tests', () => {
  test('getBaseInfo calls the correct endpoint and resolves', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    const mockResponse = JSON.stringify(require('../__fixtures__/accountBaseResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(getBaseInfo({ username, clientId })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ACCOUNT_ENDPOINT}/${username}`, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getBaseInfo calls the correct endpoint and resolves when using account_id', async () => {
    const accountId = '1234';
    const clientId = 'myClientId';

    const mockResponse = JSON.stringify(require('../__fixtures__/accountBaseResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(getBaseInfo({ accountId, clientId })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ACCOUNT_ENDPOINT}/?account_id=${accountId}`, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });
});

describe('getBlockStatus tests', () => {
  test('getBlockStatus calls the correct endpoint and resolves', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/getBlockStatusResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(getBlockStatus({ username, accessToken })).resolves.toMatchSnapshot();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${BLOCK_STATUS_ENDPOINT.replace('<username>', username)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });
});

describe('getBlocks tests', () => {
  test('getBlocks calls the correct endpoint and resolves', async () => {
    const accessToken = 'myAccessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/getBlocksResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(getBlocks(accessToken)).resolves.toMatchSnapshot();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(BLOCKS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });
});

describe('createBlock tests', () => {
  test('createBlock calls the correct endpoint', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/createBlockResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(createBlock({ username, accessToken })).resolves.toMatchSnapshot();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
      },
    );
  });
});

describe('deleteBlock tests', () => {
  test('deleteBlock calls the correct endpoint', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/deleteBlockResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(deleteBlock({ username, accessToken })).resolves.toMatchSnapshot();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'DELETE',
      },
    );
  });
});

describe('getImages tests', () => {
  test('getImages calls the correct endpoint using defaults and resolves', async () => {
    const accessToken = 'myAccessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/getImagesResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = IMAGES_ENDPOINT.replace('<username>', 'me');

    await expect(getImages({ accessToken })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getImages calls the correct endpoint with username specified and resolves', async () => {
    const accessToken = 'myAccessToken';
    const username = 'testuser';

    const mockResponse = JSON.stringify(require('../__fixtures__/getImagesResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = IMAGES_ENDPOINT.replace('<username>', username);

    await expect(getImages({ accessToken, username })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getGalleryFavorites calls the correct endpoint with defaults', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    await getGalleryFavorites({ username, clientId });

    const expectedEndpoint = GALLERY_FAVORITES_ENDPOINT.replace('<username>', username);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getGalleryFavorites calls the correct endpoint with options', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';
    const page = 2;
    const favoriteSort = 'oldest';

    await getGalleryFavorites({ username, clientId, page, favoriteSort });

    const expectedEndpoint = `${GALLERY_FAVORITES_ENDPOINT.replace(
      '<username>',
      username,
    )}/${page}/${favoriteSort}`;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getFavorites calls the correct endpoint with defaults', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await getFavorites({ username, accessToken });

    const expectedEndpoint = FAVORITES_ENDPOINT.replace('<username>', username);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getFavorites calls the correct endpoint with options', async () => {
    const username = 'myUsername';
    const accessToken = 'myaccessToken';
    const page = 2;
    const sort = 'oldest';

    await getFavorites({ username, accessToken, page, sort });

    const expectedEndpoint = `${FAVORITES_ENDPOINT.replace(
      '<username>',
      username,
    )}/${page}/${sort}`;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });
});
