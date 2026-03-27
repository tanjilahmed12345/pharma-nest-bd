import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // ── Authenticated ──

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Submit payment for an order' })
  @ApiResponse({ status: 201, description: 'Payment submitted' })
  @ApiResponse({ status: 400, description: 'Invalid payment method or order' })
  async submit(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitPaymentDto,
  ) {
    return this.paymentsService.submitPayment(user.sub, dto);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get payment submissions for an order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderPayments(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.getOrderPayments(user.sub, orderId);
  }

  // ── Admin / Staff ──

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verify or reject a payment (admin/staff)' })
  @ApiResponse({ status: 200, description: 'Payment verification updated' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.verifyPayment(id, dto, user.sub);
  }
}
