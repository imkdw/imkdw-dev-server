/**
 * @see {@link https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=ko#obtainingaccesstokens}
 */
export type GoogleAuthorizationParams = {
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  /**
   * 요청 범위
   * @see {@link https://developers.google.com/identity/protocols/oauth2/scopes?hl=ko#oauth2}
   */
  scope: string;
  state: string;
};

/**
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko#exchange-authorization-code}
 */
export type GoogleGetAccessTokenBody = {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
};

/**
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko#exchange-authorization-code}
 */
export type GoogleGetAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
};

export type GoogleUserInfoResponse = {
  sub: string;
  email: string;
  name: string;
};
