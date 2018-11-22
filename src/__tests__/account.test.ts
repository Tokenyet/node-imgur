jest.mock('node-fetch', () => jest.fn(() => Promise.resolve()));
const fetch = require.requireMock('node-fetch');

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
  fetch.mockClear();
});

describe('getAccessToken tests', () => {
  test('getAccessToken returns a resolved Promise on success', async () => {
    const credentials = {
      refreshToken: 'myRefreshToken',
      clientId: 'myId',
      clientSecret: 'mySecret',
    };

    await expect(generateAccessToken(credentials)).resolves.toBe(undefined);
  });

  test('getAccessToken calls the correct endpoint', async () => {
    const credentials = {
      refreshToken: 'myRefreshToken',
      clientId: 'myId',
      clientSecret: 'mySecret',
    };

    await generateAccessToken(credentials);

    const expectedParams = new URLSearchParams();
    expectedParams.append('refresh_token', credentials.refreshToken);
    expectedParams.append('client_id', credentials.clientId);
    expectedParams.append('client_secret', credentials.clientSecret);
    expectedParams.append('grant_type', 'refresh_token');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(OAUTH2_TOKEN_ENDPOINT, {
      body: expectedParams,
      method: 'POST',
    });
  });
});

describe('getBaseInfo tests', () => {
  test('base returns a resolved Promise on success', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    await expect(getBaseInfo({ username, clientId })).resolves.toBe(undefined);
  });

  test('getBaseInfo calls the correct endpoint', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    await getBaseInfo({ username, clientId });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${ACCOUNT_ENDPOINT}/${username}`, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getBaseInfo calls the correct endpoint when using account_id', async () => {
    const accountId = '1234';
    const clientId = 'myClientId';

    await getBaseInfo({ clientId, accountId });

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
  test('getBlockStatus returns a resolved Promise on success', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await expect(getBlockStatus({ username, accessToken })).resolves.toBe(undefined);
  });

  test('getBlockStatus calls the correct endpoint', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await getBlockStatus({ username, accessToken });

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
  test('getBlocks returns a resolved Promise on success', async () => {
    const accessToken = 'myAccessToken';

    await expect(getBlocks(accessToken)).resolves.toBe(undefined);
  });

  test('getBlocks calls the correct endpoint', async () => {
    const accessToken = 'myAccessToken';

    await getBlocks(accessToken);

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
  test('createBlock returns a resolved Promise on success', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await expect(createBlock({ username, accessToken })).resolves.toBe(undefined);
  });

  test('createBlock calls the correct endpoint', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await createBlock({ username, accessToken });

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
  test('deleteBlock returns a resolved Promise on success', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await expect(deleteBlock({ username, accessToken })).resolves.toBe(undefined);
  });

  test('deleteBlock calls the correct endpoint', async () => {
    const username = 'myUsername';
    const accessToken = 'myAccessToken';

    await deleteBlock({ username, accessToken });

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
  test('getImages returns a resolved Promise on success', async () => {
    const accessToken = 'myAccessToken';

    await expect(getImages({ accessToken })).resolves.toBe(undefined);
  });

  test('getImages calls the correct endpoint using defaults', async () => {
    const accessToken = 'myAccessToken';

    await getImages({ accessToken });

    const expectedEndpoint = IMAGES_ENDPOINT.replace('<username>', 'me');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getImages calls the correct endpoint with username specified', async () => {
    const accessToken = 'myAccessToken';
    const username = 'testuser';

    await getImages({ accessToken, username });

    const expectedEndpoint = IMAGES_ENDPOINT.replace('<username>', username);
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
