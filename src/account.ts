import fetch from 'node-fetch';
import {
  IAccessTokenRequestData,
  IBaseInfoOptions,
  IBlockOptions,
  IAccountImagesOptions,
  IGalleryFavoritesOptions,
  IFavoritesOptions,
} from './types';
import { URLSearchParams } from 'url';

const OAUTH2_TOKEN_ENDPOINT = 'https://api.imgur.com/oauth2/token';

const ACCOUNT_ENDPOINT = 'https://api.imgur.com/3/account';

const BLOCK_STATUS_ENDPOINT = 'https://api.imgur.com/account/v1/<username>/block';
const BLOCKS_ENDPOINT = 'https://api.imgur.com/3/account/me/block';
const BLOCK_CREATE_DELETE_ENDPOINT = 'https://api.imgur.com/account/v1/<username>/block';

const IMAGES_ENDPOINT = 'https://api.imgur.com/3/account/<username>/images';

const GALLERY_FAVORITES_ENDPOINT = 'https://api.imgur.com/3/account/<username>/gallery_favorites';

const FAVORITES_ENDPOINT = 'https://api.imgur.com/3/account/<username>/favorites';

/**
 * Get an access token
 * @param data IAccessTokenRequestData
 */
function generateAccessToken(data: IAccessTokenRequestData): Promise<any> {
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

function getBlockStatus({ username, accessToken }: IBlockOptions) {
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

function createBlock({ username, accessToken }: IBlockOptions) {
  return fetch(`${BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
  });
}

function deleteBlock({ username, accessToken }: IBlockOptions) {
  return fetch(`${BLOCK_CREATE_DELETE_ENDPOINT.replace('<username>', username)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'DELETE',
  });
}

function getImages({ accessToken, username = 'me' }: IAccountImagesOptions) {
  return fetch(IMAGES_ENDPOINT.replace('<username>', username), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
}

function getGalleryFavorites(options: IGalleryFavoritesOptions) {
  const { username, clientId } = options;
  let endpoint = GALLERY_FAVORITES_ENDPOINT.replace('<username>', username);

  if (options.page) {
    endpoint = `${endpoint}/${options.page}`;
    if (options.favoriteSort) {
      endpoint = `${endpoint}/${options.favoriteSort}`;
    }
  }

  return fetch(endpoint, {
    headers: {
      Authorization: `Client-ID ${clientId}`,
    },
    method: 'GET',
  });
}

function getFavorites(options: IFavoritesOptions) {
  const { username, accessToken } = options;
  let endpoint = FAVORITES_ENDPOINT.replace('<username>', username);

  if (options.page) {
    endpoint = `${endpoint}/${options.page}`;
    if (options.sort) {
      endpoint = `${endpoint}/${options.sort}`;
    }
  }

  return fetch(endpoint, {
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
  GALLERY_FAVORITES_ENDPOINT,
  FAVORITES_ENDPOINT,
  generateAccessToken,
  getBaseInfo,
  getBlockStatus,
  getBlocks,
  createBlock,
  deleteBlock,
  getImages,
  getGalleryFavorites,
  getFavorites,
};
