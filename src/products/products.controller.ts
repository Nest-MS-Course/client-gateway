import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.natsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }

  @Get()
  findProducts(
    @Query() paginationDto: PaginationDto
  ) {
    return this.natsClient
      .send({ cmd: 'find_all_products' }, paginationDto )
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return this.natsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) })
      );

    /* try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id })
      );

      return product;
    } catch (error) {
      throw new RpcException(error);
    } */
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.natsClient
      .send({ cmd: 'update_product' }, { id: +id, ...updateProductDto })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.natsClient
      .send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }  
}
