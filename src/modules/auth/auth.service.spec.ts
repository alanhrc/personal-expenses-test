import { Environments } from '@/config/env/env'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'

describe('Auth Service', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: Environments?.JWT_SECRET,
          signOptions: { expiresIn: `${Environments?.JWT_EXPIRES_IN}` },
        }),
      ],
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signIn', () => {
    it('should sign in and generate JWT token', async () => {
      const result = await service.signIn()

      expect(result).toHaveProperty('access_token')
      expect(typeof result.access_token).toBe('string')
      expect(result.access_token.length).toBeGreaterThan(0)
    })
  })
})
