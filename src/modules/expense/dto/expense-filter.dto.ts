import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class ExpenseFilterDto {
  @ApiPropertyOptional({ example: 5, description: 'Month to filter (1-12)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number

  @ApiPropertyOptional({
    example: 2025,
    description: 'Year to filter (ex: 2025)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year?: number
}
