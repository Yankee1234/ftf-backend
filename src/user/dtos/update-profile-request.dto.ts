export class UpdateProfileRequest {
  userId!: number;

  email?: string;

  userName?: string;

  phoneNumber?: string;

  avatar?: UploadedFile;
}

interface UploadedFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}
