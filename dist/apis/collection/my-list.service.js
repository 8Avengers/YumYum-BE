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
exports.MyListService = void 0;
const collection_entity_1 = require("./entities/collection.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const collection_item_entity_1 = require("./entities/collection-item.entity");
const post_entity_1 = require("../post/entities/post.entity");
let MyListService = class MyListService {
    constructor(collectionRepository, collectionItemRepository, postRepository) {
        this.collectionRepository = collectionRepository;
        this.collectionItemRepository = collectionItemRepository;
        this.postRepository = postRepository;
    }
    async getMyListsDetail(userId, collectionId) {
        try {
            const myLists = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: {
                    user_id: userId,
                    deletedAt: null,
                    type: 'myList',
                    id: collectionId,
                },
                select: { name: true, description: true, image: true },
            });
            const myListsDetail = myLists.map((list) => ({
                name: list.name,
                description: list.description,
                image: list.image,
                collectionItems: list.collectionItems.map((item) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        id: item.id,
                        post: {
                            id: (_b = (_a = item.post) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                            rating: (_d = (_c = item.post) === null || _c === void 0 ? void 0 : _c.rating) !== null && _d !== void 0 ? _d : null,
                        },
                        restaurant: {
                            id: (_f = (_e = item.restaurant) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null,
                            place_name: (_h = (_g = item.restaurant) === null || _g === void 0 ? void 0 : _g.place_name) !== null && _h !== void 0 ? _h : null,
                        },
                    });
                }),
            }));
            console.log(myListsDetail);
            return myListsDetail;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsDetailPost(userId, restaurantId, collectionId) {
        try {
            const existRestaurant = await this.collectionItemRepository.find({
                where: {
                    restaurant: { id: restaurantId },
                    collection: { id: collectionId },
                },
                select: {
                    restaurant: {
                        id: true,
                        category_group_name: true,
                        road_address_name: true,
                        place_name: true,
                    },
                    post: {
                        content: true,
                        rating: true,
                    },
                },
                relations: ['restaurant', 'post'],
            });
            return existRestaurant;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsName(userId) {
        try {
            const myLists = await this.collectionRepository.find({
                where: { user_id: userId, deletedAt: null, type: 'myList' },
                select: { id: true, name: true },
            });
            return myLists;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsMe(userId) {
        try {
            const myLists = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: { user_id: userId, deletedAt: null, type: 'myList' },
                select: { name: true, description: true, image: true },
            });
            return myLists.map((collection) => (Object.assign(Object.assign({}, collection), { collectionItems: collection.collectionItems.slice(0, 3) })));
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsAll(userId) {
        try {
            const myLists = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: { user_id: userId, deletedAt: null, type: 'myList' },
                select: { name: true, description: true, image: true },
            });
            return myLists.map((collection) => (Object.assign(Object.assign({}, collection), { collectionItems: collection.collectionItems.slice(0, 3) })));
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async createMyList(userId, name, type) {
        try {
            const myLists = await this.collectionRepository.insert({
                user_id: userId,
                name,
                type: 'myList',
            });
            return myLists;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async updateMyList(userId, collectionId, name, image, description, visibility) {
        try {
            const myList = await this.collectionRepository.find({
                relations: {
                    user: true,
                },
            });
            if (!myList) {
                throw new common_1.NotFoundException('마이리스트가 없습니다.');
            }
            await this.collectionRepository.update({ id: collectionId }, {
                name,
                image,
                description,
                visibility,
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
    async deleteMyList(userId, id) {
        try {
            const result = await this.collectionRepository.softDelete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException('마이리스트가 없습니다.');
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
    async myListPlusPosting(postId, collectionId) {
        try {
            for (let i = 0; i < collectionId.length; i++) {
                const item = collectionId[i];
                const collectionItem = this.collectionItemRepository.create({
                    post: { id: postId },
                    collection: { id: item },
                });
                await this.collectionItemRepository.save(collectionItem);
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
    async myListMinusPosting(postId, collectionId) {
        try {
            if (collectionId) {
                await this.collectionItemRepository.delete({
                    collection: { id: collectionId },
                    post: { id: postId },
                });
            }
            else {
                throw new common_1.NotFoundException('해당 컬렉션은 없습니다.');
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
    async myListUpdatePosting(postId, collectionId) {
        try {
            const findPostId = await this.collectionItemRepository.find({
                relations: ['post', 'collection'],
                where: {
                    post: { id: postId },
                    collection: { type: 'myList' },
                },
            });
            await this.collectionItemRepository.remove(findPostId);
            this.myListPlusPosting(postId, collectionId);
            return;
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
MyListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(1, (0, typeorm_1.InjectRepository)(collection_item_entity_1.CollectionItem)),
    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository])
], MyListService);
exports.MyListService = MyListService;
//# sourceMappingURL=my-list.service.js.map