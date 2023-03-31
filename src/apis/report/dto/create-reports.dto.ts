import { IsNumber, IsString, IsEnum } from 'class-validator';

enum ReportType {
  USER = 'user',
  COMMENT = 'comment',
  POST = 'post',
}

export class CreateReportDto {
  @IsString()
  readonly description: string;
}
