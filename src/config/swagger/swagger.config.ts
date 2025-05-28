import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function ConfigSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Personal Expenses API')
    .setDescription('API to personal expenses control')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
