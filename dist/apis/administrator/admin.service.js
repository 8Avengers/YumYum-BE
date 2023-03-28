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
exports.AdminService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
let AdminService = class AdminService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async userWithdrawal(userId) {
        try {
            const result = await this.userRepository.softDelete(userId);
            if (result.affected === 0) {
                throw new common_1.NotFoundException('해당 유저가 없습니다.');
            }
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async userBanLists(userId) {
        try {
            const userBan = await this.userRepository.findOne({
                where: { id: userId, deleted_at: null },
                select: { deleted_at: true },
            });
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async updateRestaurant(userId) {
        try {
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async deletePost(postId) {
        try {
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async deleteComment(commentId) {
        try {
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map