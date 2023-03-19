/// <reference types="multer" />
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';
export declare class UploadService {
    private readonly configService;
    private readonly awsS3;
    readonly S3_BUCKET_NAME: string;
    constructor(configService: ConfigService);
    uploadPostImageToS3(folder: string, file: Express.Multer.File): Promise<{
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
        contentType: string;
        postImage: string;
    }>;
    uploadProfileImageToS3(folder: string, file: Express.Multer.File): Promise<{
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
        contentType: string;
        profileImage: string;
    }>;
    deleteS3Object(key: string, callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void): Promise<{
        success: true;
    }>;
    getAwsS3FileUrl(objectKey: string): string;
}
