import { Environments } from '@/config/env/env'
import { INestApplication } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('Auth Controller (e2e)', () => {
  let app: INestApplication
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: Environments?.JWT_SECRET,
          signOptions: { expiresIn: `${Environments?.JWT_EXPIRES_IN}` },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', async () => {
    expect(controller).toBeDefined()
  })

  it('(POST) - /auth/login - should return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send()
      .expect(200)

    expect(response.body).toHaveProperty('access_token')
  })

  it('(GET) - /auth/profile - should return user logged info', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/login')
      .send()
      .expect(200)

    const accessToken = responseAuth.body.access_token

    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(response.body).toMatchObject({
      sub: expect.any(String),
      username: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    })
  })

  it('(GET) - /auth/profile - should not return user with invalid or expired token', async () => {
    const accessToken = 'invalid-token'

    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(401)

    expect(response.body).toMatchObject({
      message: expect.any(String),
      statusCode: expect.any(Number),
    })
  })
})
