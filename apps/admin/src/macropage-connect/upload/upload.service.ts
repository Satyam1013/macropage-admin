import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { TUTORIAL_TYPES } from './upload.constants';

/**
 * Uploads tutorial media (images/video/pdf embedded in help docs) to the
 * same DigitalOcean Spaces bucket the real macropage-connect product uses,
 * under a distinct `admin-tutorials/` key prefix so it never collides with
 * tenant-scoped `media/{tenantId}/...` keys the real backend writes.
 */
@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly cdnBase: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('DO_SPACES_BUCKET', 'macropage-media');
    this.region = this.config.get<string>('DO_SPACES_REGION', 'sfo3');
    const endpoint = `https://${this.region}.digitaloceanspaces.com`;
    this.cdnBase = `https://${this.bucket}.${this.region}.digitaloceanspaces.com`;

    this.s3 = new S3Client({
      region: this.region,
      endpoint,
      credentials: {
        accessKeyId: this.config.get<string>('DO_SPACES_KEY', ''),
        secretAccessKey: this.config.get<string>('DO_SPACES_SECRET', ''),
      },
      forcePathStyle: false,
    });
  }

  async uploadTutorial(file: Express.Multer.File): Promise<{ url: string }> {
    if (!TUTORIAL_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only images, mp4/webm video, or PDF are allowed for tutorials',
      );
    }
    if (file.size > 100 * 1024 * 1024) {
      throw new BadRequestException('File must be under 100MB');
    }

    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `admin-tutorials/${randomUUID()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return { url: `${this.cdnBase}/${key}` };
  }
}
