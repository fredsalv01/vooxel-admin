import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BucketService {
  private readonly storage: Storage;
  private readonly logger = new Logger(BucketService.name);
  private readonly bucketName: string;

  constructor() {
    const GCP_PROJECT_ID = 'file-upload-app-b9ae4'; // reemplaza
    const GCP_KEY_FILE_PATH = 'gcp-app.json'; // REEMPLAZAR
    const credentials = {
      "type": process.env.GCP_TYPE,
      "project_id": process.env.GCP_PROJECT_ID,
      "private_key_id": process.env.GCP_PRIVATE_KEY_ID,
      "private_key": process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      "client_email": process.env.GCP_CLIENT_EMAIL,
      "client_id": process.env.GCP_CLIENT_ID,
      "auth_uri": process.env.GCP_AUTH_URI,
      "token_uri": process.env.GCP_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.GCP_AUTH_PROVIDER_CERT_URL,
      "client_x509_cert_url": process.env.GCP_CLIENT_CERT_URL,
      "universe_domain": process.env.UNIVERSE_DOMAIN
    }
    this.bucketName = 'staging.file-upload-app-b9ae4.appspot.com'; // REEMPLAZAR
    this.storage = new Storage({
      projectId: GCP_PROJECT_ID,
      credentials
    });
  }

  private async corsConfig() {
    await this.storage.bucket(this.bucketName).setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ['GET', 'PUT'],
        origin: ['*'],
        responseHeader: ['Content-Type'],
      },
    ]);
  }

  async generateV4UploadSignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ url: string; filePath: string; fileName: string }> {
    let folder = 'files/';
    if (fileType === 'cv') {
      folder += 'cv/';
    } else if (fileType === 'certification') {
      folder += 'certifications/';
    } else if (fileType === 'psychological_test') {
      folder += 'psychological_tests/';
    } else if (fileType === 'profile_photo') {
      folder += 'profile_photos/';
    } else if (fileType === 'contract') {
      folder += 'contracts/';
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
      await this.corsConfig();

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
        fileName,
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
        responseDisposition: 'attachment',
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
