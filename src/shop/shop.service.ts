import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { CreateProductRequest } from './dtos/create-product-request.dto';
import { CreateStripeProductRequest } from './payments/dtos/create-product-request.dto';
import { PaymentsService } from './payments/payments.service';
import Money from 'bigint-money';
import { Product } from 'src/domain/entities/product.entity';
import { ProductItem } from './dtos/product-item.dto';
import { ProductsList } from './dtos/products-list.dto';

@Injectable()
export class ShopService {
    constructor(private readonly paymentService: PaymentsService, private readonly log: PinoLogger,
        private readonly productsRepo: ProductRepository) {}

    async createProduct(req: CreateProductRequest) {
        try {
            const product = await this.productsRepo.getByProductName(req.name);

            if(product) throw new InternalServerErrorException('Product with the same name exists');

            const newProduct = await this.productsRepo.create();

            const stripeProduct = await this.paymentService.createProduct(new CreateStripeProductRequest(req.name, new Money(req.amount, req.currency), newProduct.id));

            newProduct.name = req.name;
            newProduct.stripePriceId = stripeProduct.priceId;
            newProduct.stripeProductId = stripeProduct.productId;
            newProduct.moneyAmount = req.amount;
            newProduct.moneyCurrency = req.currency;

            await this.productsRepo.save(newProduct);
        } catch(err) {
            this.log.error('Error during creating product', { err } )
        }
    }

    async getAllProducts() {
        const { products, total } = await this.productsRepo.getAllProducts();

        if(products.length <= 0) {
            throw new NotFoundException('Products not found');
        }

        return new ProductsList(total, products.map((p) => ShopService.toProductItemDto(p)));
    }

    static toProductItemDto(product: Product): ProductItem {
        const dto = new ProductItem();

        dto.name = product.name;
        dto.amount = product.moneyAmount;
        dto.currency = product.moneyCurrency;

        return dto;
    }
}
