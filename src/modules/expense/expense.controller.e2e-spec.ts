import { DatabaseModule } from '@/config/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { CreateExpenseDto } from './dto/create-expense.dto'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'

describe('Expense Controller (e2e)', () => {
  let app: INestApplication
  let controller: ExpenseController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ExpenseController],
      providers: [ExpenseService],
    }).compile()

    controller = module.get<ExpenseController>(ExpenseController)
    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  let expenseId: string

  it('(POST) - /expenses - should create an expense', async () => {
    const expense: CreateExpenseDto = {
      title: 'Compra no mercado',
      amount: 150.75,
      category: 'Alimentação',
      date: new Date().toISOString(),
    }

    const res = await request(app.getHttpServer())
      .post('/expenses')
      .send(expense)
      .expect(201)

    expect(res.body).toHaveProperty('expense')
    expect(res.body.expense).toMatchObject({
      id: expect.any(String),
      title: 'Compra no mercado',
      amount: 150.75,
      category: 'Alimentação',
    })

    expenseId = res.body.expense.id
  })

  it('(GET) - /expenses - should return all expenses', async () => {
    const res = await request(app.getHttpServer()).get('/expenses').expect(200)

    expect(Array.isArray(res.body.expenses)).toBe(true)
  })

  it('(GET) - /expenses/:id - should return one expense', async () => {
    const res = await request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .expect(200)

    expect(res.body).toHaveProperty('expense')
    expect(res.body.expense.id).toBe(expenseId)
  })

  it('(PATCH) - /expenses/:id - should update an expense', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/expenses/${expenseId}`)
      .send({ title: 'Mercado atualizado' })
      .expect(200)

    expect(res.body.expense.title).toBe('Mercado atualizado')
  })

  it('(DELETE) - /expenses/:id - should delete an expense', async () => {
    await request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .expect(204)
  })
})
