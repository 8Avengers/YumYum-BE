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
            const bookmarks = await this.collectionItemRepository.find({
                relations: {
                    post: {
                        images: true,
                    },
                    collection: true,
                },
                where: {
                    collection: {
                        user_id: userId,
                        deletedAt: null,
                        type: 'bookmark',
                    },
                },
                select: {
                    collection: {
                        id: true,
                        name: true,
                    },
                    post: {
                        id: true,
                        images: {
                            id: true,
                            file_url: true,
                        },
                    },
                },
            });
            const newBookmarks = bookmarks.map((item) => {
                var _a;
                const { collection: { id, name }, post, } = item;
                return {
                    id,
                    name,
                    image: (post === null || post === void 0 ? void 0 : post.images) && ((_a = post === null || post === void 0 ? void 0 : post.images) === null || _a === void 0 ? void 0 : _a.length) > 0
                        ? post === null || post === void 0 ? void 0 : post.images[0].file_url
                        : '',
                };
            });
            return newBookmarks;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getCollections(collectionId, userId) {
        try {
            const posts = await this.collectionItemRepository.find({
                relations: {
                    post: {
                        images: true,
                    },
                },
                where: {
                    collection: {
                        id: collectionId,
                        user_id: userId,
                        deletedAt: null,
                        type: 'bookmark',
                    },
                },
                select: {
                    collection: {
                        id: true,
                    },
                    post: {
                        id: true,
                        images: { id: true, file_url: true },
                    },
                },
            });
            const transformedPosts = posts.map((post) => ({
                id: post.post.id,
                images: post.post.images[0].file_url,
            }));
            return transformedPosts;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async createCollection(userId, name) {
        try {
            const newBookmark = await this.collectionRepository.insert({
                user_id: userId,
                name: name,
                type: 'bookmark',
                visibility: 'private',
            });
            const newCollectionItem = await this.collectionItemRepository.insert({
                collection: newBookmark.identifiers[0].id,
            });
            return newCollectionItem;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async updateCollection(collectionId, name) {
        try {
            const bookmarkUpdate = await this.collectionRepository.update({ id: collectionId }, {
                name: name,
            });
            if (bookmarkUpdate.affected === 0) {
                throw new common_1.NotFoundException('북마크가 없습니다.');
            }
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
    async basicCollectionPlusPosting(postId, userId) {
        try {
            const basicBookmark = await this.collectionRepository.findOne({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                },
            });
            const existingItem = await this.collectionItemRepository.findOne({
                where: {
                    post: { id: postId },
                    collection: { id: basicBookmark.id },
                },
            });
            if (existingItem) {
                return;
            }
            const collectionItem = this.collectionItemRepository.create({
                post: { id: postId },
                collection: { id: basicBookmark.id },
            });
            await this.collectionItemRepository.save(collectionItem);
            return collectionItem;
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
    async basicCollectionMinusPosting(postId, userId) {
        try {
            const basicBookmark = await this.collectionRepository.findOne({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                },
            });
            const existingItem = await this.collectionItemRepository.findOne({
                where: {
                    post: { id: postId },
                    collection: { id: basicBookmark.id },
                },
            });
            if (existingItem) {
                await this.collectionItemRepository.remove(existingItem);
            }
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
            return collectionItem;
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
            const deletePost = await this.collectionItemRepository.delete({
                collection: { id: collectionId },
                post: { id: postId },
            });
            return deletePost;
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
    async isAllPostsBookmarkedByUser(userId, postIds) {
        const bookmarkCollection = await this.collectionRepository.findOne({
            where: { type: 'bookmark', user_id: userId },
        });
        if (!bookmarkCollection) {
            return postIds.map((postId) => {
                return { postId, isBookmarked: 'False' };
            });
        }
        const bookmarkCollectionItems = await this.collectionItemRepository.find({
            where: {
                collection: { id: bookmarkCollection.id },
                post: { id: (0, typeorm_2.In)(postIds) },
            },
            relations: ['post', 'collection'],
        });
        return postIds.map((postId) => {
            const isBookmarked = bookmarkCollectionItems.some((bookmark) => bookmark.post.id === postId);
            return { postId, isBookmarked: isBookmarked ? 'True' : 'False' };
        });
    }
    async isOnePostBookmarkedByUser(userId, postId) {
        const bookmarkCollection = await this.collectionRepository.findOne({
            where: { type: 'bookmark', user_id: userId },
        });
        if (!bookmarkCollection) {
            return { isBookmarked: 'False' };
        }
        const bookmarkCollectionItem = await this.collectionItemRepository.findOne({
            where: {
                collection: { id: bookmarkCollection.id },
                post: { id: postId },
            },
            relations: ['post', 'collection'],
        });
        return { isBookmarked: bookmarkCollectionItem ? 'True' : 'False' };
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