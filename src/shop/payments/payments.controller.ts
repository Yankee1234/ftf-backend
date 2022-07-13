import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { AuthRole } from 'src/auth/security';
import { AttachPaymentMethodRequest } from './dtos/attach-payment-method-request.dto';
import { PaymentMethod } from './dtos/payment-methods.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {

    constructor(private readonly paymentService: PaymentsService) {}

    @Get('payments')
    @Auth()
    @ApiOperation({ summary: 'Get user payments'})
    async getPaymentList(@Req() req: PrivateRequest) {
        if(req.user.role !== AuthRole.User) throw new UnauthorizedException('You are not a user');

        return await this.paymentService.getAllUserPayments(req.user.id);
    }

    @Post('payment-method')
    @Auth()
    @ApiOperation({ summary: 'Attach payment method' })
    @ApiBody({ type: AttachPaymentMethodRequest})
    async attachPaymentMethod(@Req() req: PrivateRequest, @Body() data: AttachPaymentMethodRequest) {
        return await this.paymentService.attachPaymentMethod(data, req.user);
    }

    @Get('payment-method')
    @Auth()
    @ApiOperation({ summary: 'Get users payment methods'})
    async getPaymentMethods(@Req() req: PrivateRequest) {
        return await this.paymentService.getPaymentMethods(req.user.id);
    }
}
