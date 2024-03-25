import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { catchError } from 'rxjs';
import { PaginationOrderDto } from './dto/pagination-orders.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) {}

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.natsClient
      .send('createOrder', createOrderDto)
      .pipe(
        catchError( err => { throw new RpcException(err) }  )
      );
  }

  @Get()
  findOrders(
    @Query() paginationDto: PaginationOrderDto
  ) {
    return this.natsClient
      .send('findAllOrders', paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.natsClient
      .send('findOneOrder', { id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.natsClient
      .send('changeOrderStatus', { id, ...statusDto })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
  }
}
