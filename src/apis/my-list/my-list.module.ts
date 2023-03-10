import { MyListService } from './my-list.service';
import { MyListController } from './my-list.controller';
import { MyList } from './entities/my-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
@Module({
  imports: [TypeOrmModule.forFeature([MyList])],
  controllers: [MyListController],
  providers: [MyListService],
})
export class MyListModule {}
