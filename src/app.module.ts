import { config } from 'dotenv';
config();
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingModule } from './billing/billing.module';
import { TransactionModule } from './transaction/transaction.module';
import * as Joi from 'joi';
import { AuthModule, AuthService } from '@cryptodo/common';
import axios from 'axios';
import { ReferralModule } from './referral/referral.module';
import { ServiceApiModule } from './service-api/services-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging')
          .default('development'),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().optional(),
      }),
      validationOptions: { abortEarly: true },
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
        process.env.DB_HOST
      }:${process.env.DB_PORT || 27017}/BillingApi`,
    ),
    BillingModule,
    TransactionModule,
    AuthModule,
    ReferralModule,
    ServiceApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private authService: AuthService) {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${authService.serviceToken}`;
  }
}
