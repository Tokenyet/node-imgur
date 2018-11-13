import fetch from 'node-fetch';
import { IAccessTokenRequestData, IBaseInfoOptions } from './types';
import { URLSearchParams } from 'url';

const OAUTH2_TOKEN_ENDPOINT = 'https://api.imgur.com/oauth2/token';

const ACCOUNT_ENDPOINT = 'https://api.imgur.com/3/account';

const BLOCK_STATUS_ENDPOINT = 'https://api.imgur.com/account/v1/<username>/block';
const BLOCKS_ENDPOINT = 'https://api.imgur.com/3/account/me/block';
const BLOCK_CREATE_DELETE_ENDPOINT = 'https://api.imgur.com/account/v1/<username>/block';

const IMAGES_ENDPOINT = 'https://api.imgur.com/3/account/me/images';

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

function getBaseInfo(options: IBaseInfoOptions) {
  const { username, clientId, accountId } = options;
  let endpoint = ACCOUNT_ENDPOINT;

  if (username && clientId) {
    endpoint = `${ACCOUNT_ENDPOINT}/${username}`;
  }

  if (clientId && accountId) {
    endpoint = `${ACCOUNT_ENDPOINT}/?account_id=${accountId}`;
  }

  return fetch(endpoint, {
    headers: {
      Authorization: `Client-ID ${clientId}`,
    },
    method: 'GET',
  });
}

function getBlockStatus(username: string, accessToken: string) {
  return fetch(`${BLOCK_STATUS_ENDPOINT.replace('<username>', username)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
}

function getBlocks(accessToken: string) {
  return fetch(BLOCKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
}

function createBlock(username: string, accessToken: string) {
  return fetch(`${BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
  });
}

function deleteBlock(username: string, accessToken: string) {
  return fetch(`${BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'DELETE',
  });
}

function getImages(accessToken: string) {
  return fetch(IMAGES_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
}

export {
  OAUTH2_TOKEN_ENDPOINT,
  ACCOUNT_ENDPOINT,
  BLOCK_STATUS_ENDPOINT,
  BLOCKS_ENDPOINT,
  BLOCK_CREATE_DELETE_ENDPOINT,
  IMAGES_ENDPOINT,
  getAccessToken,
  getBaseInfo,
  getBlockStatus,
  getBlocks,
  createBlock,
  deleteBlock,
  getImages,
};
