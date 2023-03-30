import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './entities/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reports])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

//Nest는 ReportService(?)의 종속성을 해결할 수 없습니다. 인덱스 [0]의 인수 UserRepository가 다음에서 사용 가능한지 확인하십시오.
//ReportModule 컨텍스트
