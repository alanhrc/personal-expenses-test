import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreateExpenseDto } from './create-expense.dto'

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsOptional()
  @ApiProperty({
    example: 'Aluguel',
    description: 'Expense title',
    required: false,
  })
  @IsString()
  title?: string

  @IsOptional()
  @ApiProperty({
    example: 1200.5,
    description: 'Expense value',
    required: false,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  amount?: number

  @IsOptional()
  @ApiProperty({
    example: 'Habitação',
    description: 'Expense category',
    required: false,
  })
  @IsString()
  category?: string

  @IsOptional()
  @ApiProperty({
    example: '2025-05-28T00:00:00.000Z',
    description: 'Expense date on format ISO (DateTime)',
    required: false,
  })
  @IsISO8601({}, { message: 'date must be a valid ISO 8601 Date string' })
  date?: string
}
