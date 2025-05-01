/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity}
 */
export interface GithubAuthorizationParams {
  client_id: string;
  redirect_uri: string;
  state: string;
  /**
   * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps}
   */
  scope: string;
}

/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github}
 */
export interface GithubGetAccessTokenBody {
  client_id: string;
  client_secret: string;
  code: string;
}

/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github}
 */
export interface GithubGetAccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/**
 * @see {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api}
 */
export interface GithubUserInfoResponse {
  id: number;
  email: string;
}
