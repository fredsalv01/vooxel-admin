import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  
  presignedUrl() {
    return `Hello presigned Url http://localhost:3005/files/presigned-url`;
  }
}
