import { IsString, Length } from 'class-validator';

export class StartTestDto {
  @IsString()
  @Length(3, 64)
  specimenId!: string;
}
