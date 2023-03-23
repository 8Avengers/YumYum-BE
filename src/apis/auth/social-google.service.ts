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
    console.log('code가 socialgoogleservice에 들어오는가', code);

    try {
      const response = await lastValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', null, {
          params: {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      console.log(
        'getOauth2Token from social-google.service.ts?',
        response.data,
      );

      return response.data;
    } catch (err) {
      console.error(err); // log the error for debugging
      throw new BadRequestException({
        message: 'Invalid login request.',
      });
    }
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
