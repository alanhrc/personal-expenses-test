import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'dotenv/config'
import { AppModule } from './app.module'
import { Environments } from './config/env/env'
import { ConfigSwagger } from './config/swagger/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )

  ConfigSwagger(app)

  await app.listen(Environments?.PORT ?? 3000, () => {
    console.log(`Server is running on port ${Environments?.PORT ?? 3000}`)
  })
}
bootstrap()
