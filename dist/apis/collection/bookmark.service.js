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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const collection_entity_1 = require("./entities/collection.entity");
const collection_item_entity_1 = require("./entities/collection-item.entity");
let BookmarkService = class BookmarkService {
    constructor(collectionRepository, collectionItemRepository) {
        this.collectionRepository = collectionRepository;
        this.collectionItemRepository = collectionItemRepository;
    }
    async getBookmarks(userId) {
        try {
            const bookmarks = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: { user_id: userId, deletedAt: null, type: 'bookmark' },
                select: { name: true, image: true },
            });
            return bookmarks;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getCollections(collectionId) {
        try {
            const bookmark = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: { id: collectionId, deletedAt: null, type: 'bookmark' },
            });
            return bookmark;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    createCollection(userId, name, type) {
        return this.collectionRepository.insert({
            user_id: userId,
            name: name,
            type: 'bookmark',
        });
    }
    async updateCollection(collectionId, name) {
        try {
            const bookmarkUpdate = await this.collectionRepository.update({ id: collectionId }, {
                name: name,
            });
            return bookmarkUpdate;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async deleteCollection(collectionId) {
        try {
            const result = await this.collectionRepository.softDelete(collectionId);
            if (result.affected === 0) {
                throw new common_1.NotFoundException('북마크가 없습니다.');
            }
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async collectionPlusPosting(collectionId, postId) {
        try {
            const existingItem = await this.collectionItemRepository.findOne({
                where: {
                    collection: { id: collectionId },
                    post: { id: postId },
                },
            });
            if (existingItem) {
                return;
            }
            const collectionItem = this.collectionItemRepository.create({
                collection: { id: collectionId },
                post: { id: postId },
            });
            await this.collectionItemRepository.save(collectionItem);
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async collectionMinusPosting(collectionId, postId) {
        try {
            await this.collectionItemRepository.delete({
                collection: { id: collectionId },
                post: { id: postId },
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async collectionPlusRestaurant(collectionId, restaurantId) {
        try {
            const existingItem = await this.collectionItemRepository.findOne({
                where: {
                    collection: { id: collectionId },
                    restaurant: { id: restaurantId },
                },
            });
            console.log('북마크 레스토링', existingItem);
            if (existingItem) {
                return;
            }
            await this.collectionItemRepository.insert({
                collection: { id: collectionId },
                restaurant: { id: restaurantId },
            });
        }
        catch (err) {
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async collectionMinusRestaurant(collectionId, restaurantId) {
        try {
            await this.collectionItemRepository.delete({
                collection: { id: collectionId },
                restaurant: { id: restaurantId },
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
};
BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(1, (0, typeorm_1.InjectRepository)(collection_item_entity_1.CollectionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookmarkService);
exports.BookmarkService = BookmarkService;
//# sourceMappingURL=bookmark.service.js.map