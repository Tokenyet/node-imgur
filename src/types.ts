interface IAccessTokenRequestData {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

interface IBaseInfoOptions {
  username?: string;
  clientId: string;
  accountId?: string;
}

interface IBlockOptions {
  username: string;
  accessToken: string;
}

interface IAccountImagesOptions {
  accessToken: string;
  username?: string;
}

interface IGalleryFavoritesOptions {
  clientId: string;
  username: string;
  page?: number;
  favoriteSort?: string;
}

interface IFavoritesOptions {
  accessToken: string;
  username: string;
  page?: number;
  sort?: string;
}

interface ISubmissionOptions {
  clientId: string;
  username: string;
  page?: number;
}

interface IAvailableAvatarsOptions {
  username: string;
  accessToken?: string;
  clientId?: string;
}

interface IAvatarOptions {
  username: string;
  accessToken: string;
}

interface ISettingsOptions {
  accessToken: string;
  bio?: string;
  public_images?: string;
  messaging_enabled?: boolean;
  album_privacy?: string;
  accepted_gallery_terms?: boolean;
  username?: string;
  show_mature?: boolean;
  newsletter_subscribed?: boolean;
  [propName: string]: any;
}

interface IGalleryProfileOptions {
  accessToken: string;
  [propName: string]: any;
}

interface IVerifyEmailOptions {
  accessToken: string;
  username: string;
  [propName: string]: any;
}

export {
  IAccessTokenRequestData,
  IBaseInfoOptions,
  IBlockOptions,
  IAccountImagesOptions,
  IGalleryFavoritesOptions,
  IFavoritesOptions,
  ISubmissionOptions,
  IAvailableAvatarsOptions,
  IAvatarOptions,
  ISettingsOptions,
  IGalleryProfileOptions,
  IVerifyEmailOptions,
};
