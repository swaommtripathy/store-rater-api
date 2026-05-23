import { IsString, MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Store name must be a string' })
  @MinLength(3, { message: 'Store name must be at least 3 characters' })
  @MaxLength(100, { message: 'Store name cannot exceed 100 characters' })
  name!: string;

  @IsString({ message: 'Address must be a string' })
  @MinLength(5, { message: 'Address must be at least 5 characters' })
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  address!: string;

  @IsString({ message: 'City must be a string' })
  @MinLength(2, { message: 'City must be at least 2 characters' })
  @MaxLength(50, { message: 'City cannot exceed 50 characters' })
  city!: string;

  @IsString({ message: 'State must be a string' })
  @MinLength(2, { message: 'State must be at least 2 characters' })
  @MaxLength(50, { message: 'State cannot exceed 50 characters' })
  state!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Owner ID must be a number' })
  ownerId?: number; // Optional: Admin can assign owner during creation
}