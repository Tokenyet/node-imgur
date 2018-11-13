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

export { IAccessTokenRequestData, IBaseInfoOptions };
