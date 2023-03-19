"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionItem = void 0;
const post_entity_1 = require("../../post/entities/post.entity");
const restaurant_entity_1 = require("../../restaurant/entities/restaurant.entity");
const typeorm_1 = require("typeorm");
const collection_entity_1 = require("./collection.entity");
let CollectionItem = class CollectionItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CollectionItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => collection_entity_1.Collection, (collection) => collection.collectionItems),
    (0, typeorm_1.JoinColumn)({ name: 'collection_id' }),
    __metadata("design:type", collection_entity_1.Collection)
], CollectionItem.prototype, "collection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => restaurant_entity_1.Restaurant, (restaurant) => restaurant.collectionItems),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], CollectionItem.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => post_entity_1.Post, (post) => post.collectionItems),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", post_entity_1.Post)
], CollectionItem.prototype, "post", void 0);
CollectionItem = __decorate([
    (0, typeorm_1.Entity)()
], CollectionItem);
exports.CollectionItem = CollectionItem;
//# sourceMappingURL=collection-item.entity.js.map