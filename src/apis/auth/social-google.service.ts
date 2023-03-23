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

  // async getOauth2Token({ code }: SocialLoginBodyDTO) {

  //   console.log("code가 socialgoogleservice에 들어오는가", code);
  //   const response = await lastValueFrom(
  //     this.httpService.post('https://oauth2.googleapis.com/token', null, {
  //       params: {
  //         code,
  //         client_id: this.clientId,
  //         client_secret: this.clientSecret,
  //         redirect_uri: this.redirectUri,
  //         grant_type: 'authorization_code',
  //       },
  //     }),
  //   ).catch((err: AxiosError) => {
  //     throw new BadRequestException({
  //       message: 'Invalid login request.',
  //     });
  //   });
  //   console.log("code가 socialgoogleservice에 들어오는가", code);
  //   console.log('getOauth2Token from social-google.service.ts?', response.data);

  //   return response.data;
  // }

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

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AxiosError } from 'axios';
// import { lastValueFrom } from 'rxjs';
// import { HttpService } from '@nestjs/axios';

// @Injectable()
// export class SocialGoogleService {
//   private clientId: string;
//   private clientSecret: string;
//   private redirectUri: string;

//   constructor(
//     private httpService: HttpService,
//     private configService: ConfigService,
//   ) {
//     this.clientId = configService.get('GOOGLE_CLIENTID');
//     this.clientSecret = configService.get('GOOGLE_CLIENTSECRET');
//     this.redirectUri = configService.get('GOOGLE_CALLBACKURL');
//   }

//   async getAccessTokenFromGoogle(code: string) {
//     console.log('Inside getAccessTokenFromGoogle method'); // 로그 추가
//     console.log('getAccessTokenFromGoogle내부의code가 들어오나?!!', code);
//     const response = await lastValueFrom(
//       this.httpService.post('https://oauth2.googleapis.com/token', null, {
//         params: {
//           code,
//           client_id: this.clientId,
//           client_secret: this.clientSecret,
//           redirect_uri: this.redirectUri,
//           grant_type: 'authorization_code',
//         },
//       }),
//     ).catch((err: AxiosError) => {
//       console.error('Error in getAccessTokenFromGoogle:', err); // 로그 추가

//       throw new BadRequestException({
//         message: 'Invalid login request.',
//         error: err.response?.data,
//       });
//     });

//     // console.log('getAccessTokenFromGoogle:', response.data.access_token);

//     return response.data.access_token;
//   }

//   async getGoogleUserProfile(accessToken: string) {
//     const googleProfileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };

//     try {
//       const response = await lastValueFrom(
//         this.httpService.get(googleProfileUrl, { headers }),
//       );

//       return {
//         email: response.data.email,
//         nickname: response.data.name,
//         name: response.data.family_name,
//       };
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       if (axiosError.response) {
//         throw new BadRequestException(axiosError.response.data);
//       }
//       throw error;
//     }
//   }

//   // Add other methods to handle Google OAuth2 flow if needed.
// }
