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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const post_like_service_1 = require("./post-like.service");
const post_hashtag_service_1 = require("./post-hashtag.service");
const my_list_service_1 = require("../collection/my-list.service");
const comment_entity_1 = require("../comment/entities/comment.entity");
const restaurant_service_1 = require("../restaurant/restaurant.service");
const image_repository_1 = require("./image.repository");
const upload_service_1 = require("../upload/upload.service");
const collection_item_entity_1 = require("../collection/entities/collection-item.entity");
const post_like_entity_1 = require("./entities/post-like.entity");
const post_user_tag_service_1 = require("./post-user-tag.service");
let PostService = class PostService {
    constructor(postRepository, commentRepository, collectionItemRepository, postLikeRepository, imageRepository, likeService, postHashtagService, myListService, restaurantService, uploadService, postUserTagService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.collectionItemRepository = collectionItemRepository;
        this.postLikeRepository = postLikeRepository;
        this.imageRepository = imageRepository;
        this.likeService = likeService;
        this.postHashtagService = postHashtagService;
        this.myListService = myListService;
        this.restaurantService = restaurantService;
        this.uploadService = uploadService;
        this.postUserTagService = postUserTagService;
    }
    async getPosts(userId, page) {
        try {
            const pageNum = Number(page) - 1;
            const posts = await this.postRepository.find({
                where: { deleted_at: null, visibility: 'public' },
                select: {
                    id: true,
                    content: true,
                    rating: true,
                    updated_at: true,
                    created_at: true,
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
                    postUserTags: { id: true, user: { nickname: true } },
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
                    postUserTags: { user: true },
                },
                order: { created_at: 'desc' },
                skip: pageNum * 8,
                take: 8,
            });
            if (!posts || posts.length === 0) {
                throw new common_1.NotFoundException('포스트가 없습니다.');
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
                const userTags = post.postUserTags.map((userTag) => userTag.user.nickname);
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
                    userTags,
                };
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async getPostById(postId, userId) {
        try {
            const post = await this.postRepository.find({
                where: { id: postId, deleted_at: null, visibility: 'public' },
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
                        x: true,
                        y: true,
                    },
                    user: { id: true, nickname: true, profile_image: true },
                    images: { id: true, file_url: true },
                    collectionItems: { id: true, collection: { id: true } },
                    postUserTags: { id: true, user: { nickname: true } },
                },
                relations: {
                    user: true,
                    restaurant: true,
                    hashtags: true,
                    images: true,
                    collectionItems: {
                        collection: true,
                    },
                    postUserTags: { user: true },
                },
            });
            if (!post) {
                throw new common_1.NotFoundException(`존재하지 않는 포스트입니다.`);
            }
            const totalLikes = await this.likeService.getLikesForPost(postId);
            const hashtags = post[0].hashtags.map(({ name }) => ({ name }));
            const { isLiked } = await this.likeService.getLikedStatusforOnePost(postId, userId);
            const totalComments = await this.commentRepository.count({
                where: { deleted_at: null, post: { id: postId } },
            });
            const myList = post[0].collectionItems.map((item) => ({
                id: item.collection.id,
            }));
            const userTags = post[0].postUserTags.map((userTag) => userTag.user.nickname);
            return {
                id: post[0].id,
                content: post[0].content,
                rating: post[0].rating,
                updated_at: post[0].updated_at,
                user: post[0].user,
                restaurant: post[0].restaurant,
                images: post[0].images,
                totalLikes,
                hashtags,
                isLiked,
                totalComments,
                myList,
                visibility: post[0].visibility,
                userTags,
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
    async createPost(userId, address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y, myListIds, content, rating, visibility, hashtagNames, files) {
        try {
            const createdRestaurant = await this.restaurantService.createRestaurant(address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y);
            const restaurantId = createdRestaurant;
            const post = await this.postRepository.create({
                user: { id: userId },
                restaurant: { id: restaurantId },
                content,
                rating,
                visibility,
            });
            const hashtags = await this.postHashtagService.createOrUpdateHashtags(hashtagNames);
            post.hashtags = hashtags;
            await this.postRepository.save(post);
            const postId = post.id;
            files.map(async (file) => {
                try {
                    const uploadedFile = await this.uploadService.uploadPostImageToS3('yumyumdb-post', file);
                    await this.imageRepository.save({
                        file_url: uploadedFile.postImage,
                        post: { id: postId },
                    });
                }
                catch (err) {
                    console.error(err);
                    throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
                }
            });
            await this.myListService.myListPlusPosting(postId, myListIds);
            return { postId: postId };
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async updatePost(id, address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y, myListId, content, rating, visibility, hashtagNames, newFiles, originalFiles) {
        try {
            const post = await this.postRepository.findOne({
                where: { id },
                relations: ['hashtags', 'images'],
            });
            if (!post) {
                throw new common_1.NotFoundException(`존재하지 않는 포스트입니다.`);
            }
            let createdRestaurant;
            if (kakao_place_id) {
                createdRestaurant = await this.restaurantService.createRestaurant(address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y);
            }
            const restaurantId = createdRestaurant;
            const updateData = {};
            if (restaurantId) {
                updateData.restaurant = { id: restaurantId };
            }
            if (content) {
                updateData.content = content;
            }
            if (rating) {
                updateData.rating = rating;
            }
            if (visibility) {
                updateData.visibility = visibility;
            }
            if (hashtagNames) {
                const existingHashtags = post.hashtags.map((hashtag) => hashtag.name);
                const newHashtags = (await this.postHashtagService.createOrUpdateHashtags(hashtagNames)).map((hashtag) => hashtag.name);
                if (existingHashtags.sort().join(',') !== newHashtags.sort().join(',')) {
                    const hashtags = await this.postHashtagService.createOrUpdateHashtags(hashtagNames);
                    updateData.hashtags = hashtags;
                }
            }
            await this.postRepository.save(Object.assign(Object.assign({}, post), updateData), { reload: true });
            if (!Array.isArray(originalFiles)) {
                originalFiles = [originalFiles];
            }
            let newPostImages;
            if (newFiles) {
                const uploadedFiles = newFiles.map(async (image) => {
                    try {
                        return await this.uploadService.uploadPostImageToS3('yumyumdb-post', image);
                    }
                    catch (err) {
                        console.error(err);
                        throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
                    }
                });
                const results = await Promise.all(uploadedFiles);
                newPostImages = results.map((result) => {
                    return result.postImage;
                });
            }
            await this.imageRepository.updatePostImages(newPostImages, originalFiles, post);
            if (myListId) {
                await this.myListService.myListUpdatePosting(id, myListId);
            }
            return { postId: id };
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                console.error(err);
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async deletePost(id) {
        try {
            const result = await this.postRepository.softDelete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
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
    async getPostsByMyId(userId, page) {
        try {
            const pageNum = Number(page) - 1;
            const posts = await this.postRepository.find({
                where: { deleted_at: null, visibility: 'public', user: { id: userId } },
                select: {
                    id: true,
                    content: true,
                    rating: true,
                    updated_at: true,
                    visibility: true,
                    created_at: true,
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
                    postUserTags: { id: true, user: { nickname: true } },
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
                    postUserTags: { user: true },
                },
                order: { created_at: 'desc' },
                skip: pageNum * 8,
                take: 8,
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
                const userTags = post.postUserTags.map((userTag) => userTag.user.nickname);
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
                    userTags,
                };
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async getPostsByOtherUserId(userId, myUserId, page) {
        try {
            const pageNum = Number(page) - 1;
            const posts = await this.postRepository.find({
                where: { deleted_at: null, visibility: 'public', user: { id: userId } },
                select: {
                    id: true,
                    content: true,
                    rating: true,
                    updated_at: true,
                    visibility: true,
                    created_at: true,
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
                    postUserTags: { id: true, user: { nickname: true } },
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
                    postUserTags: { user: true },
                },
                order: { created_at: 'desc' },
                skip: pageNum * 8,
                take: 8,
            });
            if (!posts || posts.length === 0) {
                return [];
            }
            const postIds = posts.map((post) => post.id);
            const postLikes = await this.likeService.getLikesForAllPosts(postIds);
            const likedStatuses = await this.likeService.getLikedStatusforAllPosts(postIds, myUserId);
            return posts.map((post) => {
                var _a, _b;
                const hashtags = post.hashtags.map((hashtag) => hashtag.name);
                const likes = ((_a = postLikes.find((like) => like.postId === post.id)) === null || _a === void 0 ? void 0 : _a.totalLikes) || 0;
                const isLiked = ((_b = likedStatuses.find((status) => status.postId === post.id)) === null || _b === void 0 ? void 0 : _b.isLiked) ||
                    'False';
                const totalComments = post.comments ? post.comments.length : 0;
                const userTags = post.postUserTags.map((userTag) => userTag.user.nickname);
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
                    userTags,
                };
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async getTrendingPosts(category) {
        try {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const trendingPosts = await this.postRepository
                .createQueryBuilder('post')
                .leftJoin('post.postLikes', 'postLikes')
                .leftJoin('post.restaurant', 'restaurant')
                .leftJoin('post.user', 'user')
                .leftJoin('post.images', 'image')
                .select('post.id')
                .addSelect([
                'post.content',
                'post.rating',
                'post.updated_at',
                'post.created_at',
            ])
                .addSelect('COUNT(postLikes.id) as postLikesCount')
                .groupBy("TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END), restaurant.place_name, user.profile_image, user.nickname")
                .orderBy('postLikesCount', 'DESC')
                .where('post.visibility = :visibility', { visibility: 'public' })
                .where('postLikes.updated_at >= :date', { date })
                .where("TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END) = :category", { category: category })
                .addSelect("TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END)", 'category')
                .addSelect('restaurant.place_name')
                .addSelect('user.profile_image')
                .addSelect('user.nickname')
                .addSelect('image.file_url')
                .addSelect('postLikes.id')
                .take(5)
                .getMany();
            return trendingPosts;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getPostsAroundMe(x, y, userId, page) {
        try {
            const pageNum = Number(page) - 1;
            const postsAroundMe = await this.postRepository
                .createQueryBuilder('post')
                .leftJoin('post.restaurant', 'restaurant')
                .leftJoin('post.images', 'image')
                .leftJoinAndSelect('post.hashtags', 'hashtags')
                .leftJoin('post.user', 'user')
                .select([
                'post.id',
                'post.content',
                'post.rating',
                'post.updated_at',
                'post.visibility',
                'post.created_at',
            ])
                .addSelect([
                'restaurant.kakao_place_id',
                'restaurant.address_name',
                'restaurant.category_name',
                'restaurant.place_name',
                'restaurant.road_address_name',
            ])
                .addSelect(['user.id', 'user.nickname', 'user.profile_image'])
                .addSelect(`6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${x})) + sin(radians(${y})) * sin(radians(y)))`, 'distance')
                .addSelect('hashtags.name')
                .addSelect('image.file_url')
                .having(`distance <= 3`)
                .orderBy('post.created_at', 'DESC')
                .skip(pageNum * 8)
                .take(8)
                .getMany();
            if (!postsAroundMe) {
                throw new common_1.NotFoundException('포스트가 없습니다.');
            }
            const postIds = postsAroundMe.map((post) => post.id);
            const postLikes = await this.likeService.getLikesForAllPosts(postIds);
            const likedStatuses = await this.likeService.getLikedStatusforAllPosts(postIds, userId);
            return postsAroundMe.map((post, index) => {
                var _a, _b;
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
                    hashtags: post.hashtags,
                    totalLikes: likes,
                    isLiked,
                    totalComments,
                    visibility: post.visibility,
                };
            });
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(collection_item_entity_1.CollectionItem)),
    __param(3, (0, typeorm_1.InjectRepository)(post_like_entity_1.PostLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        image_repository_1.ImageRepository,
        post_like_service_1.PostLikeService,
        post_hashtag_service_1.PostHashtagService,
        my_list_service_1.MyListService,
        restaurant_service_1.RestaurantService,
        upload_service_1.UploadService,
        post_user_tag_service_1.PostUserTagService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map