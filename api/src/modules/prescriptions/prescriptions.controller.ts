import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ReviewPrescriptionDto } from './dto/review-prescription.dto';
import { PrescriptionQueryDto } from './dto/prescription-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  // ── Authenticated ──

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.createPrescription(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user prescriptions' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: PrescriptionQueryDto,
  ) {
    return this.prescriptionsService.getUserPrescriptions(user.sub, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get prescription detail' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.getUserPrescriptionById(user.sub, id);
  }

  // ── Admin / Pharmacist ──

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Review prescription (admin/pharmacist)' })
  @ApiResponse({ status: 200, description: 'Prescription reviewed' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewPrescriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.prescriptionsService.reviewPrescription(id, dto, user.sub);
  }
}
