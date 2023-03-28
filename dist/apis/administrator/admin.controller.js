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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guards_1 = require("../auth/guards/auth.guards");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async userWithdrawal(userId) {
        return await this.adminService.userWithdrawal(userId);
    }
    async userBanLists(userId) {
        return await this.adminService.userBanLists(userId);
    }
    async updateRestaurant(restaurantId) {
        return await this.adminService.updateRestaurant(restaurantId);
    }
    async deletePost(postId) {
        return await this.adminService.deletePost(postId);
    }
    async deleteComment(commentId) {
        return await this.adminService.deleteComment(commentId);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '유저 강제탈퇴' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: '유저 강제탈퇴 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 강제탈퇴 실패' }),
    (0, common_1.Post)('/user-withdrawal/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "userWithdrawal", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '유저 정지' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: '유저 정지 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 정지 실패' }),
    (0, common_1.Post)('/add-ban-list/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "userBanLists", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '레스토랑 정보 수정' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: '유저 정지 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 정지 실패' }),
    (0, common_1.Post)('/restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRestaurant", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '포스트 삭제' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: '유저 정지 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 정지 실패' }),
    (0, common_1.Post)('/delete-post/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '댓글 삭제' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: '유저 정지 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 정지 실패' }),
    (0, common_1.Post)('/delete-comment/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteComment", null);
AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map