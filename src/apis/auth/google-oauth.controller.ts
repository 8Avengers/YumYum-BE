import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import {
  GoogleOauthService,
  GoogleTokensResult,
  GoogleUserResult,
} from './google-oauth.service';

@Controller('google')
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}

  @Post('oauth-tokens')
  async getGoogleOAuthTokens(
    @Body('code') code: string,
  ): Promise<GoogleTokensResult> {
    console.log('컨트롤러에서code가 먼저 들어오는지 확인', code);

    return this.googleOauthService.getOAuthTokensFromGoogle({ code });
  }

  @Get('user')
  async getGoogleUser(@Req() req): Promise<GoogleUserResult> {
    const { id_token, access_token } = req.query;
    return this.googleOauthService.getUserInfoFromGoogle({
      id_token,
      access_token,
    });
  }
}
