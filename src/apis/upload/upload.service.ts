import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class UploadService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(
    private readonly configService: ConfigService, //
  ) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  //S3에 Post Image 업로드
  async uploadPostImageToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
    postImage: string;
  }> {
    try {
      const sharp = require('sharp');
      const inputImageBuffer = file.buffer;

      //sharp 라이브러리로 이미지 리사이징
      const resizedImageBuffer = await sharp(inputImageBuffer)
        .resize(500, 500, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer()
        .catch((error) => {
          console.error(error);
          throw new BadRequestException(
            `이미지 리사이징을 올바르게 다시 해주세요. : ${error}`,
          );
        });

      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: resizedImageBuffer, //리사이징 프로필사이즈용
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      console.log('s3Object가 뭘까?::', s3Object);
      const postImage = `https://${this.S3_BUCKET_NAME}.s3.${this.awsS3.config.region}.amazonaws.com/${key}`;

      return { key, s3Object, contentType: file.mimetype, postImage };
    } catch (error) {
      throw new BadRequestException(
        `파일 업로드를 올바르게 다시 해주세요. : ${error}`,
      );
    }
  }

  //S3에 프로필사진 업로드
  async uploadProfileImageToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
    profileImage: string;
  }> {
    try {
      const sharp = require('sharp');
      const inputImageBuffer = file.buffer;

      //sharp 라이브러리로 이미지 리사이징
      const resizedImageBuffer = await sharp(inputImageBuffer)
        .resize(100, 100, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer()
        .catch((error) => {
          console.error(error);
          throw new BadRequestException(
            `이미지 리사이징을 다시 해주세요.: ${error}`,
          );
        });

      // const filePath = `${Date.now()}_${path.basename(
      //   file.originalname,
      // )}`.replace(/ /g, '');

      // const key = `${folder}/${filePath}`; // 데이터베이스에 넣을 filePath

      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: resizedImageBuffer, //리사이징 프로필사이즈용
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      console.log('s3Object가 뭘까?::', s3Object);
      const profileImage = `https://${this.S3_BUCKET_NAME}.s3.${this.awsS3.config.region}.amazonaws.com/${key}`;

      return { key, s3Object, contentType: file.mimetype, profileImage };
    } catch (error) {
      throw new BadRequestException(
        `파일 업로드를 올바르게 다시 해주세요. : ${error}`,
      );
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(
        `파일을 올바르게 다시 삭제해주세요. : ${error}`,
      );
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }
}
