import { PrismaService } from '@/config/database/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Expense } from '@prisma/client'
import { CreateExpenseDto } from './dto/create-expense.dto'
import { ExpenseFilterDto } from './dto/expense-filter.dto'
import { UpdateExpenseDto } from './dto/update-expense.dto'

interface ExpenseFilterDate {
  gte: Date
  lt: Date
}

@Injectable()
export class ExpenseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ title, amount, category, date }: CreateExpenseDto) {
    const expense = await this.prismaService.expense.create({
      data: {
        title,
        amount,
        category,
        date,
      },
    })

    return { expense: this.toNumberedExpense(expense) }
  }

  async findAll(filter: ExpenseFilterDto) {
    const { month, year } = filter

    let dateFilter: ExpenseFilterDate | null = null

    if (year && month) {
      dateFilter = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      }
    } else if (year) {
      dateFilter = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      }
    } else if (month) {
      const yearNow = new Date().getFullYear()

      dateFilter = {
        gte: new Date(yearNow, month - 1, 1),
        lt: new Date(yearNow, month, 1),
      }
    }

    const where: {
      deletedAt?: null
      date?: ExpenseFilterDate
    } = {
      deletedAt: null,
    }

    if (dateFilter) {
      where.date = dateFilter
    }

    const expenses = await this.prismaService.expense.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    })

    return { expenses: expenses.map(this.toNumberedExpense) }
  }

  async findOne(id: string) {
    const expense = await this.prismaService.expense.findUnique({
      where: {
        id,
      },
    })

    if (!expense) {
      throw new NotFoundException('Expense with given ID not found')
    }

    return { expense: this.toNumberedExpense(expense) }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expenseFound = await this.findOne(id)

    const expense = await this.prismaService.expense.update({
      where: {
        id: expenseFound.expense.id,
      },
      data: {
        title: updateExpenseDto.title,
        amount: updateExpenseDto.amount,
        category: updateExpenseDto.category,
        date: updateExpenseDto.date,
      },
    })

    return { expense: this.toNumberedExpense(expense) }
  }

  async remove(id: string): Promise<void> {
    const expenseFound = await this.findOne(id)

    await this.prismaService.expense.update({
      where: {
        id: expenseFound.expense.id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  private toNumberedExpense(expense: Expense) {
    return {
      ...expense,
      amount: Number(expense.amount),
    }
  }
}
