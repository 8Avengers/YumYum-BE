import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import logger from 'src/common/utills/logger';

export interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOauthService {
  private clientId = this.configService.get('GOOGLE_CLIENTID');
  private clientSecret = this.configService.get('GOOGLE_CLIENTSECRET');
  private redirectUri = this.configService.get('GOOGLE_CALLBACKURL');

  constructor(private configService: ConfigService) {}

  async getOAuthTokensFromGoogle({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    console.log('getOAuthTokensFromGoogle메소드작동하는지 확인중::', code);

    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    console.log(values);

    try {
      const res = await axios.post<GoogleTokensResult>(url, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('getOAuthTokensFromGoogle통과후', res.data);

      return res.data;
    } catch (error: any) {
      console.error('Error response from Google API:', error.response.data);
      logger.error(error, 'Failed to fetch Google Oauth Tokens');
      throw new Error(error.message);
    }
  }

  async getUserInfoFromGoogle({
    id_token,
    access_token,
  }: {
    id_token: string;
    access_token: string;
  }): Promise<GoogleUserResult> {
    try {
      const res = await axios.get<GoogleUserResult>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      );

      console.log('getUserInfoFromGoogle통과후', res.data);

      return res.data;
    } catch (error: any) {
      console.error(error);

      logger.error(error, 'Error fetching Google user');

      throw new Error(error.message);
    }
  }
}
