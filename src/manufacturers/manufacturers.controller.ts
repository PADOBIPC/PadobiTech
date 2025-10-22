// src/manufacturers/manufacturers.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <-- Импорт
import { RolesGuard } from '../auth/roles.guard';     // <-- Импорт
import { Roles } from '../auth/roles.decorator';       // <-- Импорт
import { Role } from '../auth/roles.enum';           // <-- Импорт

@ApiTags('Manufacturers')
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Защищаем
  @Roles(Role.Admin)                   // ✅ Только админ
  @ApiBearerAuth()                     // ✅ Указываем Swagger'у
  @ApiOperation({ summary: 'Create a new manufacturer (Admin only)' })
  @ApiResponse({ status: 201, description: 'Created successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all manufacturers' })
  @ApiResponse({ status: 200, description: 'List of manufacturers.'})
  findAll() {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific manufacturer by ID' })
  @ApiParam({ name: 'id', description: 'Manufacturer ID', type: Number })
  @ApiResponse({ status: 200, description: 'Manufacturer details.'})
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Защищаем
  @Roles(Role.Admin)                   // ✅ Только админ
  @ApiBearerAuth()                     // ✅ Указываем Swagger'у
  @ApiOperation({ summary: 'Update a manufacturer (Admin only)' })
  @ApiParam({ name: 'id', description: 'Manufacturer ID', type: Number })
  @ApiResponse({ status: 200, description: 'Updated successfully.'})
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateManufacturerDto: UpdateManufacturerDto) {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Защищаем
  @Roles(Role.Admin)                   // ✅ Только админ
  @ApiBearerAuth()                     // ✅ Указываем Swagger'у
  @ApiOperation({ summary: 'Delete a manufacturer (Admin only)' })
  @ApiParam({ name: 'id', description: 'Manufacturer ID', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted successfully.'}) // Или 204
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturersService.remove(id);
  }
}