import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { BuyProductDto } from './dto/buy-product.dto';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { catchError, switchMap } from 'rxjs/operators';
import { map, throwError } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SubscriptionEnum } from './product/product.enum';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {

    public constructor(
        private readonly paymentService: PaymentService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @HttpCode(200)
    @Post('callback/buy')
    public paymentSuccessCallback(@User() user: UsersDocuments) {
        return this.paymentService.productService.getProductByParams({name: SubscriptionEnum.premium}).pipe(
            switchMap(product => this.paymentService.purchaseService.createPurchase(product.doc, user._id))
        )
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @HttpCode(200)
    @Post('/buy')
    @ApiBody({type: BuyProductDto})
    public buyProduct(@User() user: UsersDocuments, @Body() {productId}: BuyProductDto) {
        return this.paymentService.productService.getProductByParams({_id: productId}).pipe(

            switchMap(product => product.rule.buy(product.doc, user)),

            map(result => {
                if(typeof result == 'boolean') return {message : 'Subscription has been renewed'};

                return {message : 'transaction for purchase'}
            } ),

            catchError(e => throwError(() => new HttpException(e.message, HttpStatus.NOT_ACCEPTABLE)))
        )
    }

    public cancelSubscription() {

    }
}
