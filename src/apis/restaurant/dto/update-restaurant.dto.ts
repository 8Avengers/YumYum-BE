import { CreateRestaurantDto } from './create-restaurant.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
