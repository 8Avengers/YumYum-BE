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
const follow_entity_1 = require("./../user/entities/follow.entity");
const collection_entity_1 = require("./entities/collection.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const collection_item_entity_1 = require("./entities/collection-item.entity");
const post_entity_1 = require("../post/entities/post.entity");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../comment/entities/comment.entity");
const post_like_service_1 = require("../post/post-like.service");
const image_repository_1 = require("../post/image.repository");
const post_hashtag_service_1 = require("../post/post-hashtag.service");
const restaurant_service_1 = require("../restaurant/restaurant.service");
const upload_service_1 = require("../upload/upload.service");
const user_entity_1 = require("../user/entities/user.entity");
let MyListService = class MyListService {
    constructor(collectionRepository, collectionItemRepository, postRepository, commentRepository, likeService, followRepository, userRepository, imageRepository, postHashtagService, restaurantService, uploadService) {
        this.collectionRepository = collectionRepository;
        this.collectionItemRepository = collectionItemRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeService = likeService;
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
        this.postHashtagService = postHashtagService;
        this.restaurantService = restaurantService;
        this.uploadService = uploadService;
    }
    async getMyListDetail(collectionId, page) {
        try {
            let pageNum = Number(page) - 1;
            const myListInOnePage = 1;
            if (isNaN(pageNum) || pageNum < 0) {
                pageNum = 0;
            }
            const myList = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: { images: true, restaurant: true },
                    },
                },
                where: {
                    id: collectionId,
                    deletedAt: null,
                    type: 'myList',
                },
                select: {
                    id: true,
                    name: true,
                    visibility: true,
                    collectionItems: {
                        id: true,
                        post: {
                            id: true,
                            content: true,
                            rating: true,
                            images: true,
                            restaurant: {
                                id: true,
                                x: true,
                                y: true,
                                place_name: true,
                            },
                        },
                    },
                },
                skip: pageNum * myListInOnePage,
                take: myListInOnePage,
            });
            return myList.map((myList) => ({
                id: myList.id,
                name: myList.name,
                visibility: myList.visibility,
                post: myList.collectionItems.map((item) => (Object.assign(Object.assign({}, item.post), { restaurant: item.post.restaurant, images: item.post.images }))),
            }));
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsDetailPost(userId, restaurantId, collectionId, page) {
        try {
            let pageNum = Number(page) - 1;
            const myListInOnePage = 3;
            if (isNaN(pageNum) || pageNum < 0) {
                pageNum = 0;
            }
            const posts = await this.postRepository.find({
                where: {
                    deleted_at: null,
                    visibility: 'public',
                    user: { id: userId },
                    restaurant: { id: restaurantId },
                    collectionItems: { collection: { id: collectionId } },
                },
                select: {
                    id: true,
                    content: true,
                    rating: true,
                    updated_at: true,
                    visibility: true,
                    restaurant: {
                        kakao_place_id: true,
                        address_name: true,
                        category_name: true,
                        place_name: true,
                        road_address_name: true,
                    },
                    user: { id: true, nickname: true, profile_image: true },
                    images: { id: true, file_url: true },
                    collectionItems: { id: true, collection: { id: true } },
                },
                relations: {
                    user: true,
                    restaurant: true,
                    hashtags: true,
                    comments: true,
                    images: true,
                    collectionItems: {
                        collection: true,
                    },
                },
                skip: pageNum * myListInOnePage,
                take: myListInOnePage,
            });
            if (!posts || posts.length === 0) {
                return [];
            }
            const postIds = posts.map((post) => post.id);
            const postLikes = await this.likeService.getLikesForAllPosts(postIds);
            const likedStatuses = await this.likeService.getLikedStatusforAllPosts(postIds, userId);
            return posts.map((post) => {
                var _a, _b;
                const hashtags = post.hashtags.map((hashtag) => hashtag.name);
                const likes = ((_a = postLikes.find((like) => like.postId === post.id)) === null || _a === void 0 ? void 0 : _a.totalLikes) || 0;
                const isLiked = ((_b = likedStatuses.find((status) => status.postId === post.id)) === null || _b === void 0 ? void 0 : _b.isLiked) ||
                    'False';
                const totalComments = post.comments ? post.comments.length : 0;
                return {
                    id: post.id,
                    content: post.content,
                    rating: post.rating,
                    updated_at: post.updated_at,
                    user: post.user,
                    restaurant: post.restaurant,
                    images: post.images,
                    hashtags,
                    totalLikes: likes,
                    isLiked,
                    totalComments,
                    myList: post.collectionItems,
                    visibility: post.visibility,
                };
            });
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
    async getMyListsMe(userId, page) {
        try {
            const myLists = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: true,
                        restaurant: true,
                    },
                },
                where: { user_id: userId, deletedAt: null, type: 'myList' },
                select: { id: true, name: true, description: true, image: true },
            });
            return myLists;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getMyListsAll(userId, page) {
        try {
            const myLists = await this.collectionRepository.find({
                relations: {
                    collectionItems: {
                        post: {
                            images: true,
                            restaurant: true,
                        },
                    },
                },
                where: { user_id: userId, deletedAt: null, type: 'myList' },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    collectionItems: {
                        id: true,
                        post: {
                            id: true,
                            rating: true,
                            images: { id: true, file_url: true },
                            restaurant: {
                                place_name: true,
                            },
                        },
                    },
                },
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
    async getMyListInfo(collectionId) {
        try {
            const myListCheck = await this.collectionRepository.findOne({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                },
                where: {
                    id: collectionId,
                },
            });
            return myListCheck;
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
    async updateMyList(userId, collectionId, name, image, description, visibility) {
        try {
            const myList = await this.collectionRepository.update({ id: collectionId, type: 'myList', user: { id: userId } }, {
                name,
                image,
                description,
                visibility,
            });
            return {
                name,
                image,
                description,
                visibility,
            };
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
            const collectionItems = [];
            for (let i = 0; i < collectionId.length; i++) {
                const item = collectionId[i];
                const existingItem = await this.collectionItemRepository.findOne({
                    where: {
                        post: { id: postId },
                        collection: { id: item },
                    },
                });
                if (existingItem) {
                    continue;
                }
                const collectionItem = this.collectionItemRepository.create({
                    post: { id: postId },
                    collection: { id: item },
                });
                await this.collectionItemRepository.save(collectionItem);
                collectionItems.push(collectionItem);
            }
            return collectionItems;
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
            await this.myListPlusPosting(postId, collectionId);
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
    async HotMyList() {
        try {
            const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const myListSumLikes = await this.collectionItemRepository.find({
                relations: {
                    post: {
                        postLikes: true,
                        user: true,
                        images: true,
                    },
                    collection: {
                        user: true,
                    },
                },
                where: {
                    collection: {
                        type: 'myList',
                        deletedAt: null,
                    },
                    post: {
                        postLikes: {
                            deleted_at: null,
                            updated_at: (0, typeorm_2.MoreThan)(oneMonthAgo),
                        },
                    },
                },
                select: {
                    id: true,
                    post: {
                        id: true,
                        images: { id: true, file_url: true },
                        postLikes: {
                            id: true,
                        },
                        user: {
                            id: true,
                            nickname: true,
                        },
                    },
                    collection: {
                        id: true,
                        name: true,
                        user: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
                take: 2,
            });
            const groupedData = myListSumLikes.reduce((groups, item) => {
                var _a, _b, _c, _d, _e;
                const collectionId = item.collection.id;
                if (!groups[collectionId]) {
                    groups[collectionId] = {
                        collection: item.collection,
                        user: item.collection.user,
                        sumLikes: 0,
                    };
                }
                groups[collectionId].sumLikes += (_c = (_b = (_a = item.post) === null || _a === void 0 ? void 0 : _a.postLikes) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                const images = (_e = (_d = item.post) === null || _d === void 0 ? void 0 : _d.images) !== null && _e !== void 0 ? _e : [];
                const fileUrls = images.map((image) => image.file_url);
                groups[collectionId].images = fileUrls;
                return groups;
            }, {});
            const collectionSumLikes = Object.values(groupedData);
            collectionSumLikes.sort((a, b) => b.sumLikes - a.sumLikes);
            const top3Collections = collectionSumLikes
                .map(({ collection, user, sumLikes, images }) => {
                return {
                    id: collection.id,
                    name: collection.name,
                    user: {
                        id: user.id,
                        nickname: user.nickname,
                    },
                    sumLikes,
                    images,
                };
            });
            return top3Collections;
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
    async FollowersMyList(userId) {
        try {
            const followerId = await this.followRepository.find({
                where: {
                    follower: { id: userId },
                },
                select: {
                    following: { id: true },
                },
                relations: {
                    following: true,
                },
            });
            const followingIds = followerId
                .map((f) => f.following.id)
                .filter((id) => !isNaN(id));
            const myListFollwers = await this.collectionItemRepository.find({
                relations: {
                    post: {
                        user: true,
                        images: true,
                    },
                    collection: {
                        user: true,
                    },
                },
                where: {
                    collection: {
                        type: 'myList',
                        deletedAt: null,
                        user_id: (0, typeorm_2.In)(followingIds),
                    },
                },
                select: {
                    post: {
                        id: true,
                        images: { id: true, file_url: true },
                        user: {
                            id: true,
                            nickname: true,
                        },
                    },
                    collection: {
                        id: true,
                        name: true,
                        user: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
            });
            myListFollwers.sort(() => Math.random() - 0.5);
            return myListFollwers;
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
    __param(3, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(5, (0, typeorm_1.InjectRepository)(follow_entity_1.Follow)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository,
        post_like_service_1.PostLikeService,
        Repository_1.Repository,
        Repository_1.Repository,
        image_repository_1.ImageRepository,
        post_hashtag_service_1.PostHashtagService,
        restaurant_service_1.RestaurantService,
        upload_service_1.UploadService])
], MyListService);
exports.MyListService = MyListService;
//# sourceMappingURL=my-list.service.js.map