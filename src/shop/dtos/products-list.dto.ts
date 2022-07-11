import { ProductItem } from "./product-item.dto";

export class ProductsList {
    constructor(readonly total: number, readonly products: ProductItem[]) {}
}