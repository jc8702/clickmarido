import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @IsString()
  @IsOptional()
  mediaMimeType?: string;
}
