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
exports.UserSignupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_2 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const collection_entity_1 = require("../collection/entities/collection.entity");
let UserSignupService = class UserSignupService {
    constructor(userRepository, collectionRepository) {
        this.userRepository = userRepository;
        this.collectionRepository = collectionRepository;
    }
    async findOne({ email }) {
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
                throw new common_1.NotFoundException('찾는 유저가 없습니다.');
            }
            delete user.password;
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async createLocalUser({ email, hashedPassword, nickname, name, gender, birth, phoneNumber, }) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                withDeleted: true,
            });
            if (user) {
                if (user.deleted_at) {
                    throw new common_2.ConflictException('이미 탈퇴한 회원입니다.');
                }
                else {
                    throw new common_2.ConflictException('이미 등록된 이메일입니다.');
                }
            }
            const nicknameExists = await this.userRepository.findOne({
                where: { nickname },
            });
            if (nicknameExists)
                throw new common_2.ConflictException('이미 사용중인 nickname입니다.');
            const profileImageUrl = gender === 'M'
                ? 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/male.jpg'
                : 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/female.jpg';
            const local = 'local';
            const newUser = await this.userRepository.save({
                email,
                password: hashedPassword,
                nickname,
                name,
                gender,
                birth,
                phone_number: phoneNumber,
                profile_image: profileImageUrl,
                provider: local,
            });
            const collection = new collection_entity_1.Collection();
            collection.type = 'bookmark';
            collection.name = '모든 게시물';
            collection.visibility = 'private';
            collection.user = newUser;
            await this.collectionRepository.save(collection);
            return newUser;
        }
        catch (error) {
            throw error;
        }
    }
    async createOauthUser({ email, nickname, name, provider, provider_id }) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                withDeleted: true,
            });
            if (user) {
                if (user.deleted_at) {
                    throw new common_2.ConflictException('이미 탈퇴한 회원입니다.');
                }
                else {
                    throw new common_2.ConflictException('이미 등록된 이메일입니다.');
                }
            }
            const profileImageUrl = 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/male.jpg';
            const newUser = await this.userRepository.save({
                email,
                nickname,
                name,
                provider,
                provider_id,
                profile_image: profileImageUrl,
            });
            const collection = new collection_entity_1.Collection();
            collection.type = 'bookmark';
            collection.visibility = 'private';
            collection.user = newUser;
            await this.collectionRepository.save(collection);
            return newUser;
        }
        catch (error) {
            throw error;
        }
    }
    async createUserWithPassport({ email, nickname, name }) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                withDeleted: true,
            });
            if (user) {
                if (user.deleted_at) {
                    throw new common_2.ConflictException('이미 탈퇴한 회원입니다.');
                }
                else {
                    throw new common_2.ConflictException('이미 등록된 이메일입니다.');
                }
            }
            const profileImageUrl = 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/male.jpg';
            const newUser = await this.userRepository.save({
                email,
                nickname,
                name,
                profile_image: profileImageUrl,
            });
            const collection = new collection_entity_1.Collection();
            collection.type = 'bookmark';
            collection.visibility = 'private';
            collection.user = newUser;
            await this.collectionRepository.save(collection);
            return newUser;
        }
        catch (error) {
            throw error;
        }
    }
};
UserSignupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(collection_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], UserSignupService);
exports.UserSignupService = UserSignupService;
//# sourceMappingURL=user-signup.service.js.map