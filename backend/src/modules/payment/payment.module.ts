import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ProductModule } from './product/product.module';
import { PurchaseModule } from './purchase/purchase.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';

@Global()
@Module({
    controllers: [PaymentController],
    imports: [ProductModule, PurchaseModule, PaymentModule, TransactionModule, PaymentGatewayModule],
    providers: [PaymentService],
    exports: [ProductModule, PurchaseModule, PaymentModule, TransactionModule, PaymentGatewayModule, PaymentService]
})
export class PaymentModule {}
