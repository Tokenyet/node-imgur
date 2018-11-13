import fetch from 'node-fetch';
import { IAccessTokenRequestData } from './types';
import { URLSearchParams } from 'url';

const OAUTH2_TOKEN_ENDPOINT = 'https://api.imgur.com/oauth2/token';

/**
 * Get an access token
 * @param data IAccessTokenRequestData
 */
function getAccessToken(data: IAccessTokenRequestData): Promise<any> {
  const { refreshToken, clientId, clientSecret } = data;

  const params = new URLSearchParams();
  params.append('refresh_token', refreshToken);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'refresh_token');

  return fetch(OAUTH2_TOKEN_ENDPOINT, {
    body: params,
    method: 'POST',
  });
}

export { OAUTH2_TOKEN_ENDPOINT, getAccessToken };
