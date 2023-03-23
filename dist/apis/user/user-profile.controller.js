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
exports.UserProfileController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_profile_service_1 = require("./user-profile.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_guards_1 = require("../auth/guards/auth.guards");
const user_entity_1 = require("./entities/user.entity");
const user_decorators_1 = require("./user.decorators");
const platform_express_1 = require("@nestjs/platform-express");
const update_user_profile_dto_1 = require("./dto/update-user-profile.dto");
const post_service_1 = require("../post/post.service");
let UserProfileController = class UserProfileController {
    constructor(userProfileService, postService) {
        this.userProfileService = userProfileService;
        this.postService = postService;
    }
    async getMyProfile(user) {
        const myProfile = await this.userProfileService.getUserById(user.id);
        console.log(myProfile);
        const response = {
            id: myProfile.id,
            nickname: myProfile.nickname,
            introduce: myProfile.introduce,
            profile_image: myProfile.profile_image,
        };
        return response;
    }
    async updateMyProfile(user, file, updateUserProfileDto) {
        console.log('포스맨통과하면여기찍힌다.file::::::', file);
        const updatedUserProfile = await this.userProfileService.updateUserProfile({
            user,
            updateUserProfileDto,
            file,
        });
        const response = {
            id: updatedUserProfile.id,
            nickname: updatedUserProfile.nickname,
            introduce: updatedUserProfile.introduce,
            profile_image: updatedUserProfile.profile_image,
        };
        return response;
    }
    async deleteUser(user) {
        console.log(user);
        try {
            const result = await this.userProfileService.deleteUser(user);
            return result;
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUserProfile(userId, currentUser) {
        const userProfile = await this.userProfileService.getUserById(userId);
        let followStatus = null;
        if (currentUser) {
            if (currentUser.id === userId) {
                followStatus = 'me';
            }
            else {
                followStatus = await this.userProfileService.checkUserFollowRelation(currentUser.id, userId);
            }
        }
        console.log('followStatus', followStatus);
        const response = {
            id: userProfile.id,
            nickname: userProfile.nickname,
            introduce: userProfile.introduce,
            profile_image: userProfile.profile_image,
            follow_relationship: followStatus === true
                ? 'True'
                : followStatus === false
                    ? 'False'
                    : followStatus,
        };
        return response;
    }
    async getUserIdPosts(userId, currentUser, page) {
        const allPostsByUserId = await this.postService.getPostsByOtherUserId(userId, currentUser.id, page);
        return allPostsByUserId;
    }
    async followUser(follower, followingId) {
        const followingUser = await this.userProfileService.getUserById(followingId);
        if (!followingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingFollow = await this.userProfileService.getFollowByFollowerAndFollowingIds(follower.id, followingId);
        if (existingFollow) {
            await this.userProfileService.deleteUserFollowRelation(follower, followingId);
            return `${follower.nickname}님이 ${followingUser.nickname}님을 언팔로우하였어요`;
        }
        else {
            await this.userProfileService.createUserFollowRelation(follower, followingId);
            return `${follower.nickname}님이 ${followingUser.nickname}님을 팔로우하였어요`;
        }
    }
    async getFollowersOfUser(userId, page) {
        const userIdFollowers = await this.userProfileService.getFollowers(userId, page);
        return userIdFollowers;
    }
    async getFollowingsOfUser(userId, page) {
        const userIdFollowings = await this.userProfileService.getFollowings(userId, page);
        return userIdFollowings;
    }
};
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('/me'),
    (0, user_decorators_1.UpdateUserProfile)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_user_profile_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "updateMyProfile", null);
__decorate([
    (0, user_decorators_1.DeleteUser)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Delete)('/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/:userId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Get)('/:userId/posts'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserIdPosts", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Post)('/:userId/follow'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "followUser", null);
__decorate([
    (0, common_1.Get)('/:userId/followers'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getFollowersOfUser", null);
__decorate([
    (0, common_1.Get)('/:userId/followings'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getFollowingsOfUser", null);
UserProfileController = __decorate([
    (0, swagger_1.ApiTags)('유저프로필/팔로우/팔로잉'),
    (0, common_1.Controller)('/profile'),
    __metadata("design:paramtypes", [user_profile_service_1.UserProfileService,
        post_service_1.PostService])
], UserProfileController);
exports.UserProfileController = UserProfileController;
//# sourceMappingURL=user-profile.controller.js.map