"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.UpdateUserProfile = exports.signUpEmail = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_user_response_dto_1 = require("./dto/update-user-response.dto");
const user_dto_1 = require("./dto/user.dto");
const signUpEmail = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '이메일회원가입' }), (0, swagger_1.ApiResponse)({
        status: 201,
        description: '이메일회원가입 성공',
        type: user_dto_1.UserDto,
    }), (0, swagger_1.ApiResponse)({ status: 400, description: '이메일회원가입 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.signUpEmail = signUpEmail;
const UpdateUserProfile = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '유저 프로필 정보 수정' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: '유저 프로필 정보 수정 성공',
        type: update_user_response_dto_1.UpdateUserProfileResponseDto,
    }), (0, swagger_1.ApiResponse)({ status: 400, description: '유저 프로필 정보 수정 실패' }));
};
exports.UpdateUserProfile = UpdateUserProfile;
const DeleteUser = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '유저 탈퇴 - 소프트딜리트' }), (0, swagger_1.ApiResponse)({ status: 200, description: '유저 탈퇴 - 소프트딜리트 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '유저 탈퇴 - 소프트딜리트 실패' }));
};
exports.DeleteUser = DeleteUser;
//# sourceMappingURL=user.decorators.js.map