import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateExpenseDto {
  @ApiProperty({ example: 'Aluguel', description: 'Expense title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 1200.5, description: 'Expense value' })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @ApiProperty({ example: 'Habitação', description: 'Expense category' })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiProperty({
    example: '2025-05-28T00:00:00.000Z',
    description: 'Expense date on format ISO (DateTime)',
  })
  @IsISO8601({}, { message: 'date must be a valid ISO 8601 Date string' })
  @IsNotEmpty()
  date: string
}
