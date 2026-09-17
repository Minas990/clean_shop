import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customers/customer.module';
import { OrderMoudle } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    MongoModule,
    DrizzleModule,
    ProductModule,
    CustomerModule,
    OrderMoudle,
    PaymentModule
  ],
})
export class AppModule {}
