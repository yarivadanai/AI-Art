import { IsBoolean, IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  @Length(2, 32)
  specimenAlias?: string;

  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  @IsOptional()
  @IsObject()
  demographics?: Record<string, unknown>;
}
