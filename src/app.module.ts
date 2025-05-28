import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './config/database/database.module'
import { envSchema } from './config/env/env'
import { EnvModule } from './config/env/env.module'
import { AuthModule } from './modules/auth/auth.module'
import { ExpenseModule } from './modules/expense/expense.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    AuthModule,
    ExpenseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
