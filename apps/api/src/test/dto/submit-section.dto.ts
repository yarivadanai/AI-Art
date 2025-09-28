import { IsArray, IsIn, IsString, Length } from 'class-validator';

export class SubmitSectionDto {
  @IsString()
  @Length(3, 64)
  specimenId!: string;

  @IsString()
  @IsIn(['A', 'B', 'C', 'D', 'E', 'F'])
  sectionCode!: string;

  @IsArray()
  responses!: unknown[];
}
