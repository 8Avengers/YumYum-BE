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
exports.UserProfileService = void 0;
const upload_service_1 = require("./../upload/upload.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const follow_entity_1 = require("./entities/follow.entity");
let UserProfileService = class UserProfileService {
    constructor(userRepository, FollowRepository, uploadService) {
        this.userRepository = userRepository;
        this.FollowRepository = FollowRepository;
        this.uploadService = uploadService;
    }
    async findByEmail({ email }) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }
    async getUserById(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            console.log('getUserById의 id는?', id);
            if (!user) {
                throw new common_1.NotFoundException('존재하지 않는 유저입니다.');
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserByNickname(nickname) {
        try {
            const user = await this.userRepository.findOne({
                where: { nickname },
            });
            console.log('getUserById의 id는?', nickname);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async updateUserProfile({ updateUserProfileDto, user, file }) {
        const existUser = await this.userRepository.findOne({
            where: { id: user.id },
        });
        if (!existUser) {
            throw new common_1.HttpException('존재하지 않는 유저입니다.', common_1.HttpStatus.NOT_FOUND);
        }
        if (existUser) {
            existUser.nickname = updateUserProfileDto.nickname;
            existUser.introduce = updateUserProfileDto.introduce;
            if (file) {
                const uploadedFile = await this.uploadService.uploadProfileImageToS3('yumyumdb-profile', file);
                console.log('uploadProfileImageToS3의 리턴값 uploadedFile', uploadedFile);
                console.log('existUser::::', existUser);
                existUser.profile_image = uploadedFile.profileImage;
            }
            else {
                existUser.profile_image = existUser.profile_image;
            }
            const updatedUserProfile = await this.userRepository.save(existUser);
            console.log('업데이트완료후!updatedUserProfile::', updatedUserProfile);
            return {
                id: updatedUserProfile.id,
                nickname: updatedUserProfile.nickname,
                introduce: updatedUserProfile.introduce,
                profile_image: updatedUserProfile.profile_image,
            };
        }
    }
    async deleteUser(user) {
        const existingUser = await this.userRepository.findOne({
            where: { id: user.id },
        });
        if (!existingUser) {
            throw new common_1.UnprocessableEntityException('존재하지 않는 유저입니다..');
        }
        const result = await this.userRepository.softDelete({ id: user.id });
        console.log(result);
        return result.affected ? true : false;
    }
    async checkUserFollowRelation(followerId, followingId) {
        const follow = await this.FollowRepository.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
        });
        return !!follow;
    }
    async followUser(follower, followingId) {
        const followingUser = await this.getUserById(followingId);
        if (!followingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingFollow = await this.getFollowByFollowerAndFollowingIds(follower.id, followingId);
        if (existingFollow) {
            await this.deleteUserFollowRelation(follower, followingId);
            return followingUser;
        }
        else {
            await this.createUserFollowRelation(follower, followingId);
            return followingUser;
        }
    }
    async getFollowByFollowerAndFollowingIds(followerId, followingId) {
        return await this.FollowRepository.findOne({
            where: { follower: { id: followerId }, following: { id: followingId } },
        });
    }
    async createUserFollowRelation(follower, followingId) {
        try {
            console.log('follower of the service, follwingId', follower.id, followingId);
            const following = await this.getUserById(followingId);
            console.log('The value of following in service is', following);
            if (!following) {
                throw new common_1.NotFoundException('User not found');
            }
            const newFollow = await this.FollowRepository.save({
                follower,
                following,
            });
            return newFollow.following;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async deleteUserFollowRelation(follower, followingId) {
        const id = followingId;
        const following = await this.getUserById(id);
        console.log('following반환값', following);
        console.log('서비스의 follower, followingID', follower, followingId);
        if (!following) {
            throw new common_1.NotFoundException('User not found');
        }
        console.log('여기오나1');
        const follow = await this.FollowRepository.query('SELECT * FROM follow WHERE follower_id = ? AND following_id = ?', [follower.id, Number(followingId)]);
        console.log('follow 테이블의 id는?', follow);
        console.log('여기오나2');
        try {
            const follow = await this.FollowRepository.query('SELECT * FROM follow WHERE follower_id = ? AND following_id = ?', [follower.id, Number(followingId)]);
            console.log('follow 테이블의 id는?', follow);
            console.log('여기오나2');
            if (follow) {
                const result = await this.FollowRepository.query('DELETE FROM follow WHERE id = ?', [follow[0].id]);
                if (result.affectedRows === 1) {
                    return following;
                }
                else {
                    throw new Error('Failed to delete follow relationship');
                }
            }
            else {
                throw new common_1.NotFoundException('No follow relationship found');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete follow relationship');
        }
    }
    async getFollowers(userId) {
        try {
            const follows = await this.FollowRepository.find({
                where: { following: { id: userId } },
                relations: ['follower'],
            });
            const result = follows.map((follow) => ({
                id: follow.follower.id,
                nickname: follow.follower.nickname,
                profile_image: follow.follower.profile_image,
            }));
            return result;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to retrieve followers for user with id ${userId}.`);
        }
    }
    async getFollowings(userId) {
        try {
            const follows = await this.FollowRepository.find({
                where: { follower: { id: userId } },
                relations: ['following'],
            });
            const result = follows.map((follow) => ({
                id: follow.following.id,
                nickname: follow.following.nickname,
                profile_image: follow.following.profile_image,
            }));
            return result;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to retrieve followings for user with id ${userId}.`);
        }
    }
};
UserProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(follow_entity_1.Follow)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        upload_service_1.UploadService])
], UserProfileService);
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile.service.js.map