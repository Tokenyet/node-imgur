// We use the real `Response` constructor from the actual node-fetch module
const { Response } = require.requireActual('node-fetch');
// And then mock `fetch` going forward using `Response` and mock data
jest.mock('node-fetch', () =>
  jest.fn(() => Promise.resolve(new Response('{"data": [], "status": 200, "success": true}'))),
);
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
  getSubmissions,
  getAvailableAvatars,
  getAvatar,
  getSettings,
  OAUTH2_TOKEN_ENDPOINT,
  ACCOUNT_ENDPOINT,
  BLOCK_STATUS_ENDPOINT,
  BLOCKS_ENDPOINT,
  BLOCK_CREATE_DELETE_ENDPOINT,
  IMAGES_ENDPOINT,
  GALLERY_FAVORITES_ENDPOINT,
  FAVORITES_ENDPOINT,
  SUBMISSIONS_ENDPOINT,
  AVAILABLE_AVATARS_ENDPOINT,
  AVATAR_ENDPOINT,
  SETTINGS_ENDPOINT,
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

    const mockResponse = JSON.stringify(
      require('../__fixtures__/getGalleryFavoritesResponse.json'),
    );
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = GALLERY_FAVORITES_ENDPOINT.replace('<username>', username);

    await expect(getGalleryFavorites({ username, clientId })).resolves.toMatchSnapshot();
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

    const mockResponse = JSON.stringify(
      require('../__fixtures__/getGalleryFavoritesResponse.json'),
    );
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${GALLERY_FAVORITES_ENDPOINT.replace(
      '<username>',
      username,
    )}/${page}/${favoriteSort}`;

    await expect(
      getGalleryFavorites({ username, clientId, page, favoriteSort }),
    ).resolves.toMatchSnapshot();
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

    const mockResponse = JSON.stringify(require('../__fixtures__/getFavoritesResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = FAVORITES_ENDPOINT.replace('<username>', username);

    await expect(getFavorites({ username, accessToken })).resolves.toMatchSnapshot();
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

    const mockResponse = JSON.stringify(require('../__fixtures__/getFavoritesResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${FAVORITES_ENDPOINT.replace(
      '<username>',
      username,
    )}/${page}/${sort}`;

    await expect(getFavorites({ username, accessToken, page, sort })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getSubmissions calls the correct endpoint with defaults', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    const mockResponse = JSON.stringify(require('../__fixtures__/getSubmissionsResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = SUBMISSIONS_ENDPOINT.replace('<username>', username);

    await expect(getSubmissions({ username, clientId })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getSubmissions calls the correct endpoint with options', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';
    const page = 2;

    const mockResponse = JSON.stringify(require('../__fixtures__/getSubmissionsResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${SUBMISSIONS_ENDPOINT.replace('<username>', username)}/${page}`;

    await expect(getSubmissions({ username, clientId, page })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getAvailableAvatars calls the correct endpoint when unauthed', async () => {
    const username = 'myUsername';
    const clientId = 'myClientId';

    const mockResponse = JSON.stringify(
      require('../__fixtures__/getAvailableAvatarsResponse.json'),
    );
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${AVAILABLE_AVATARS_ENDPOINT.replace('<username>', username)}`;

    await expect(getAvailableAvatars({ username, clientId })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      method: 'GET',
    });
  });

  test('getAvailableAvatars calls the correct endpoint when authed', async () => {
    const username = 'myUsername';
    const accessToken = 'accessToken';

    const mockResponse = JSON.stringify(
      require('../__fixtures__/getAvailableAvatarsResponse.json'),
    );
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${AVAILABLE_AVATARS_ENDPOINT.replace('<username>', username)}`;

    await expect(getAvailableAvatars({ username, accessToken })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getAvatar calls the correct endpoint', async () => {
    const accessToken = 'accessToken';
    const username = 'myUsername';

    const mockResponse = JSON.stringify(require('../__fixtures__/getAvatarResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    const expectedEndpoint = `${AVATAR_ENDPOINT.replace('<username>', username)}`;

    await expect(getAvatar({ username, accessToken })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });

  test('getSettings calls the correct endpoint', async () => {
    const accessToken = 'accessToken';

    const mockResponse = JSON.stringify(require('../__fixtures__/getSettingsResponse.json'));
    fetch.mockReturnValue(Promise.resolve(new Response(mockResponse)));

    await expect(getSettings({ accessToken })).resolves.toMatchSnapshot();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(SETTINGS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
  });
});
