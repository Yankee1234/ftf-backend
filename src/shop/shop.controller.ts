import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { AuthRole } from 'src/auth/security';
import { BuyProductRequest } from './dtos/buy-product-request.dto';
import { CreateProductRequest } from './dtos/create-product-request.dto';
import { ShopService } from './shop.service';

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @Auth()
  @ApiBody({ type: CreateProductRequest })
  async createProduct(
    @Req() req: PrivateRequest,
    @Body() body: CreateProductRequest,
  ) {
    if (req.user.role !== AuthRole.Admin) {
      throw new UnauthorizedException('You are not an admin');
    }
    await this.shopService.createProduct(body);

    return await this.shopService.getAllProducts();
  }

  @Get()
  @Auth()
  async getAllProducts(@Req() req: PrivateRequest) {
    return await this.shopService.getAllProducts();
  }

  @Post('buy')
  @Auth()
  @ApiBody({ type: BuyProductRequest })
  async buyProduct(
    @Req() req: PrivateRequest,
    @Body() body: BuyProductRequest,
  ) {
    if (req.user.role !== AuthRole.User) {
      throw new UnauthorizedException('You are not a user');
    }
    await this.shopService.buyProduct(body, req.user);
  }
}
