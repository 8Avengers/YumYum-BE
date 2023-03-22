import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { SocialLoginBodyDTO } from './dto/social-login.dto';

@Injectable()
export class SocialGoogleService {
  private clientId = this.configService.get('GOOGLE_CLIENTID');
  private clientSecret = this.configService.get('GOOGLE_CLIENTSECRET');
  private redirectUri = this.configService.get('GOOGLE_CALLBACKURL');

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getOauth2Token({ code }: SocialLoginBodyDTO) {
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
      throw new BadRequestException({
        message: 'Invalid login request.',
      });
    });

    console.log('getOauth2Token from social-google.service.ts?', response.data);

    return response.data;
  }

  async getUserInfo(accessToken: string) {
    const response = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ).catch((err: AxiosError) => {
      throw new BadRequestException({
        message: 'Invalid access.',
      });
    });

    console.log('getUserInfo from social-google.service.ts?', response.data);

    return response.data;
  }
}
