import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { MessagesModule } from '../../chat/messages/messages.module';

@Module({
    controllers: [],
    imports: [
        MongooseModule.forFeature([
            {name: Product.name, schema: ProductSchema},
        ]),
        MessagesModule
    ],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {}
