import { IsNumber, IsString, IsEnum } from 'class-validator';

enum ReportType {
  USER = 'user',
  COMMENT = 'comment',
  POST = 'post',
}

export class CreateReportDto {
  @IsNumber()
  readonly reportedId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsEnum(ReportType)
  readonly type: ReportType;
}
