"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRestaurantDto = void 0;
const create_restaurant_dto_1 = require("./create-restaurant.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateRestaurantDto extends (0, mapped_types_1.PartialType)(create_restaurant_dto_1.CreateRestaurantDto) {
}
exports.UpdateRestaurantDto = UpdateRestaurantDto;
//# sourceMappingURL=update-restaurant.dto.js.map