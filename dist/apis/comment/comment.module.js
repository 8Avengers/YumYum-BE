"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_controller_1 = require("./comment.controller");
const comment_service_1 = require("./comment.service");
const comment_entity_1 = require("./entities/comment.entity");
const post_module_1 = require("../post/post.module");
const comment_like_controller_1 = require("./comment-like.controller");
const comment_like_service_1 = require("./comment-like.service");
const comment_like_entity_1 = require("./entities/comment-like.entity");
let CommentModule = class CommentModule {
};
CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment, comment_like_entity_1.CommentLike]), post_module_1.PostModule],
        controllers: [comment_controller_1.CommentController, comment_like_controller_1.CommentLikeController],
        providers: [comment_service_1.CommentService, comment_like_service_1.CommentLikeService],
    })
], CommentModule);
exports.CommentModule = CommentModule;
//# sourceMappingURL=comment.module.js.map