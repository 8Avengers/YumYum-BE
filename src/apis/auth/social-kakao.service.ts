import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { SocialLoginBodyDTO } from './dto/social-login.dto';

@Injectable()
export class SocialKakaoService {
  private clientId = this.configService.get('KAKAO_CLIENT_ID_RESTAPI');
  private clientSecert = this.configService.get('KAKAO_CLIENT_SECRET');
  private redirectUri = this.configService.get('KAKAO_CALLBACKURL');

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getOauth2Token({ code }: SocialLoginBodyDTO) {
    const response = await lastValueFrom(
      this.httpService.get('https://kauth.kakao.com/oauth/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecert,
          redirect_uri: this.redirectUri,
          code,
        },
      }),
    ).catch((err: AxiosError) => {
      throw new BadRequestException({
        message: '로그인 요청이 잘못되었습니다.',
      });
    });

    console.log(
      'social.kakao.service.ts에서 getOauth2Token를 실행을 무엇을 리턴해줄까?',
      response.data,
    );

    return response.data;
  }

  //유저정보 얻어오는 함수
  async getUserInfo(accessToken: string) {
    const response = await lastValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ).catch((err: AxiosError) => {
      throw new BadRequestException({
        message: '올바르지 않은 접근입니다.',
      });
    });

    console.log(
      'social.kakao.service.ts에서 getUserInfo 를 실행후 무엇을 리턴해줄까?',
      response.data,
    );

    return response.data;
  }
}
