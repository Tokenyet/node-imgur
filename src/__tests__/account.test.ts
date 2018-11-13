jest.mock('node-fetch', () => jest.fn(() => Promise.resolve()));
const fetch = require.requireMock('node-fetch');

import { getAccessToken, OAUTH2_TOKEN_ENDPOINT } from '../account';
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

    await expect(getAccessToken(credentials)).resolves.toBe(undefined);
  });

  test('getAccessToken calls the correct endpoint', async () => {
    const credentials = {
      refreshToken: 'myRefreshToken',
      clientId: 'myId',
      clientSecret: 'mySecret',
    };

    await getAccessToken(credentials);

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
