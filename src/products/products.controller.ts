import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateBatchDto } from './dto/create-batch.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }

  // ─── Lotes ───────────────────────────────────────────────
  @Post(':id/batches')
  addBatch(@Param('id') id: string, @Body() dto: CreateBatchDto) {
    return this.products.addBatch(id, dto);
  }

  @Delete(':id/batches/:batchId')
  removeBatch(@Param('id') id: string, @Param('batchId') batchId: string) {
    return this.products.removeBatch(id, batchId);
  }
}
