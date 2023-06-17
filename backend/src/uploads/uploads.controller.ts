import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { TokenData, Permission } from '../utility/decorators';
import { PermissionEnum } from '../../../shared/enums';
import { DocumentInterface, TokenInterface } from '../../../shared/interfaces';
import { UploadsService } from './uploads.service';
import { GetDocUrlDto } from './document.dto';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('/document/url')
  async getDocumentUrl(@TokenData() token: TokenInterface, @Body() body: GetDocUrlDto): Promise<{ url: string }> {
    return await this.uploadsService.getAuthedPdfUrl(token, body.fileName);
  }

  @Post('/:type/:id/document')
  @Permission(PermissionEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5000000 } }))
  async addPdfDocument(
    @TokenData() token: TokenInterface,
    @Param('type') type: number,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ): Promise<DocumentInterface> {
    if (typeof body['displayName'] == 'string') {
      const name = body['displayName'].toString();
      return await this.uploadsService.uploadPdfDocument(token, file, name, { _id: id, type: type });
    }
    throw new BadRequestException();
  }

  @Post('/:type/:id/images')
  @Permission(PermissionEnum.ADMIN)
  @UseInterceptors(FilesInterceptor('image', 20, { limits: { fileSize: 3000000 } }))
  async addEntityImages(
    @TokenData() token: TokenInterface,
    @Param('type') type: number,
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return await this.uploadsService.uploadImages({ _id: id, type: type }, images);
  }
}
