import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BucketService {
  private readonly storage: Storage;
  private readonly logger = new Logger(BucketService.name);
  private readonly bucketName: string;

  constructor() {
    const GCP_PROJECT_ID = 'file-upload-app-b9ae4';
    const GCP_KEY_FILE_PATH = 'key-gcp.json';
    this.bucketName = 'staging.file-upload-app-b9ae4.appspot.com';
    this.storage = new Storage({
      projectId: GCP_PROJECT_ID,
      keyFilename: GCP_KEY_FILE_PATH,
    });
  }

  async generateV4UploadSignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ url: string; filePath: string }> {
    let folder = 'files/';
    if (fileType === 'cv') {
      folder += 'cv/';
    } else if (fileType === 'certifications') {
      folder += 'certifications/';
    } else if (fileType === 'psychological_tests') {
      folder += 'psychological_tests/';
    }
    const filePath = `${folder}${fileName}`;
    this.logger.debug('Generated FILEPATH:', filePath);
    try {
      const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: 'application/pdf',
      };
      this.logger.debug('Generated OPTIONS:', options);

      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(filePath)
        .getSignedUrl(options);
      this.logger.debug('Generated PUT signed Url:');
      this.logger.log(url);
      this.logger.log('You can use this URL with any user agent, for example:');
      this.logger.log(
        "curl -X PUT -H 'Content-Type: application/octet-stream' " +
          `--upload-file my-file '${url}'`,
      );
      const result = {
        url,
        filePath,
      };

      this.logger.debug(
        `${this.generateV4UploadSignedUrl.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('no se pudo completar la peticion');
    }
  }

  async generateV4DownloadSignedUrl(filePath: string): Promise<string> {
    try {
      const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        responseDisposition: 'attachment'
      };
      this.logger.debug('Generated OPTIONS for download:', options);

      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(filePath)
        .getSignedUrl(options);
      this.logger.debug('Generated GET signed Url:');
      this.logger.log(url);
      return url;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Failed to generate signed URL for download',
      );
    }
  }
}
