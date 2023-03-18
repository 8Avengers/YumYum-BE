"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bookmark_controller_1 = require("./bookmark.controller");
const bookmark_service_1 = require("./bookmark.service");
const post_entity_1 = require("../post/entities/post.entity");
const collection_entity_1 = require("../collection/entities/collection.entity");
const collection_item_entity_1 = require("./entities/collection-item.entity");
const my_list_controller_1 = require("./my-list.controller");
const my_list_service_1 = require("./my-list.service");
let CollectionModule = class CollectionModule {
};
CollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([collection_entity_1.Collection, post_entity_1.Post, collection_item_entity_1.CollectionItem])],
        controllers: [bookmark_controller_1.BookmarkController, my_list_controller_1.MyListController],
        providers: [bookmark_service_1.BookmarkService, my_list_service_1.MyListService],
        exports: [my_list_service_1.MyListService, typeorm_1.TypeOrmModule],
    })
], CollectionModule);
exports.CollectionModule = CollectionModule;
//# sourceMappingURL=collection.module.js.map