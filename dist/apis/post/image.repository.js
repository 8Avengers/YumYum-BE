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
exports.ImageRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
let ImageRepository = class ImageRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(image_entity_1.Image, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async updatePostImages(imagesData, post) {
        try {
            const imagesToDelete = post.images.filter((image) => !imagesData.includes(image.file_url));
            if (imagesToDelete.length > 0) {
                await this.remove(imagesToDelete);
            }
            const newImages = imagesData
                .filter((image) => !post.images.some((existingImage) => existingImage.file_url === image))
                .map((image) => ({ file_url: image, post }));
            await this.save(newImages);
            return;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
};
ImageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ImageRepository);
exports.ImageRepository = ImageRepository;
//# sourceMappingURL=image.repository.js.map