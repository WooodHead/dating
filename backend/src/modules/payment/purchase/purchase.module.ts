import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseService } from './purchase.service';
import { Purchase, PurchaseSchema } from './purchase.schema';

@Module({
    controllers: [],
    imports: [
        MongooseModule.forFeature([
            {name: Purchase.name, schema: PurchaseSchema},
        ]),
    ],
    providers: [PurchaseService],
    exports: [PurchaseService]
})
export class PurchaseModule {}
