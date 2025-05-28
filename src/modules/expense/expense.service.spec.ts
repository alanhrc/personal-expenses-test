import { DatabaseModule } from '@/config/database/database.module'
import { PrismaService } from '@/config/database/prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ExpenseService } from './expense.service'

describe('Expense Service', () => {
  let service: ExpenseService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService
  const mockCreate = vi.fn()
  const mockFindMany = vi.fn()
  const mockFindUnique = vi.fn()
  const mockUpdate = vi.fn()

  beforeEach(async () => {
    const mockPrisma = {
      expense: {
        create: mockCreate,
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        update: mockUpdate,
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ExpenseService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile()

    service = module.get<ExpenseService>(ExpenseService)
    prisma = module.get(PrismaService)

    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create an expense and return it with amount as number', async () => {
      const mockCreated = {
        title: 'Lunch',
        amount: 25.5,
        category: 'Food',
        date: new Date().toISOString(),
      }

      mockCreate.mockResolvedValue(mockCreated)

      const result = await service.create(mockCreated)

      expect(mockCreate).toHaveBeenCalledWith({ data: mockCreated })
      expect(result).toEqual({
        expense: {
          ...mockCreated,
          amount: 25.5,
        },
      })
    })
  })

  describe('findAll', () => {
    it('should return all expenses for a specific month and year', async () => {
      const dto = { month: 5, year: 2024 }
      const mockExpenses = [
        { id: '1', title: 'Test', amount: 10, date: new Date() },
      ]

      mockFindMany.mockResolvedValue(mockExpenses)

      const result = await service.findAll(dto)

      expect(mockFindMany).toHaveBeenCalled()
      expect(result).toEqual({ expenses: mockExpenses })
    })
  })

  describe('findOne', () => {
    it('should return an expense if it exists', async () => {
      const mockExpense = {
        id: '1',
        title: 'Test',
        amount: 100,
        category: 'Misc',
        date: new Date(),
      }

      mockFindUnique.mockResolvedValue(mockExpense)

      const result = await service.findOne('1')

      expect(result).toEqual({ expense: mockExpense })
    })

    it('should throw NotFoundException if expense does not exist', async () => {
      mockFindUnique.mockResolvedValue(null)

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update and return the expense', async () => {
      const mockExpense = {
        id: '1',
        title: 'Old Title',
        amount: 20,
        category: 'Old Cat',
        date: new Date(),
      }

      mockFindUnique.mockResolvedValue(mockExpense)
      mockUpdate.mockResolvedValue({
        ...mockExpense,
        title: 'New Title',
      })

      const result = await service.update('1', {
        title: 'New Title',
        amount: 20,
        category: 'New Cat',
        date: new Date().toISOString(),
      })

      expect(mockUpdate).toHaveBeenCalled()
      expect(result.expense.title).toBe('New Title')
    })
  })

  describe('remove', () => {
    it('should soft delete the expense', async () => {
      const mockExpense = {
        id: '1',
        title: 'To Delete',
        amount: 10,
        date: new Date(),
      }

      mockFindUnique.mockResolvedValue(mockExpense)
      mockUpdate.mockResolvedValue({
        ...mockExpense,
        deletedAt: new Date(),
      })

      await service.remove('1')

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      })
    })
  })
})
