import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SocialGoogleService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.clientId = configService.get('GOOGLE_CLIENTID');
    this.clientSecret = configService.get('GOOGLE_CLIENTSECRET');
    this.redirectUri = configService.get('GOOGLE_CALLBACKURL');
  }

  async getAccessTokenFromGoogle(code: string) {
    console.log('Inside getAccessTokenFromGoogle method'); // 로그 추가
    console.log('getAccessTokenFromGoogle내부의code가 들어오나?!!', code);
    const response = await lastValueFrom(
      this.httpService.post('https://oauth2.googleapis.com/token', null, {
        params: {
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
        },
      }),
    ).catch((err: AxiosError) => {
      console.error('Error in getAccessTokenFromGoogle:', err); // 로그 추가

      throw new BadRequestException({
        message: 'Invalid login request.',
        error: err.response?.data,
      });
    });

    // console.log('getAccessTokenFromGoogle:', response.data.access_token);

    return response.data.access_token;
  }

  async getGoogleUserProfile(accessToken: string) {
    const googleProfileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(googleProfileUrl, { headers }),
      );

      return {
        email: response.data.email,
        nickname: response.data.name,
        name: response.data.family_name,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new BadRequestException(axiosError.response.data);
      }
      throw error;
    }
  }

  // Add other methods to handle Google OAuth2 flow if needed.
}
