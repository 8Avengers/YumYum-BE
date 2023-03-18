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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const path = require("path");
const AWS = require("aws-sdk");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.awsS3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
            region: this.configService.get('AWS_S3_REGION'),
        });
        this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
    }
    async uploadPostImageToS3(folder, file) {
        try {
            const sharp = require('sharp');
            const inputImageBuffer = file.buffer;
            const resizedImageBuffer = await sharp(inputImageBuffer)
                .resize(500, 500, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toBuffer()
                .catch((error) => {
                console.error(error);
                throw new common_1.BadRequestException(`이미지 리사이징을 올바르게 다시 해주세요. : ${error}`);
            });
            const key = `${folder}/${Date.now()}_${path.basename(file.originalname)}`.replace(/ /g, '');
            const s3Object = await this.awsS3
                .putObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
                Body: resizedImageBuffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            })
                .promise();
            console.log('s3Object가 뭘까?::', s3Object);
            const postImage = `https://${this.S3_BUCKET_NAME}.s3.${this.awsS3.config.region}.amazonaws.com/${key}`;
            return { key, s3Object, contentType: file.mimetype, postImage };
        }
        catch (error) {
            throw new common_1.BadRequestException(`파일 업로드를 올바르게 다시 해주세요. : ${error}`);
        }
    }
    async uploadProfileImageToS3(folder, file) {
        try {
            const sharp = require('sharp');
            const inputImageBuffer = file.buffer;
            const resizedImageBuffer = await sharp(inputImageBuffer)
                .resize(100, 100, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toBuffer()
                .catch((error) => {
                console.error(error);
                throw new common_1.BadRequestException(`이미지 리사이징을 다시 해주세요.: ${error}`);
            });
            const key = `${folder}/${Date.now()}_${path.basename(file.originalname)}`.replace(/ /g, '');
            const s3Object = await this.awsS3
                .putObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
                Body: resizedImageBuffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            })
                .promise();
            console.log('s3Object가 뭘까?::', s3Object);
            const profileImage = `https://${this.S3_BUCKET_NAME}.s3.${this.awsS3.config.region}.amazonaws.com/${key}`;
            return { key, s3Object, contentType: file.mimetype, profileImage };
        }
        catch (error) {
            throw new common_1.BadRequestException(`파일 업로드를 올바르게 다시 해주세요. : ${error}`);
        }
    }
    async deleteS3Object(key, callback) {
        try {
            await this.awsS3
                .deleteObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
            }, callback)
                .promise();
            return { success: true };
        }
        catch (error) {
            throw new common_1.BadRequestException(`파일을 올바르게 다시 삭제해주세요. : ${error}`);
        }
    }
    getAwsS3FileUrl(objectKey) {
        return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map