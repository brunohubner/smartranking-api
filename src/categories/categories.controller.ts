import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import { CreateCategoryDto } from "./dtos/categories.dto"
import { Category } from "./interfaces/category.interface"

@Controller("/api/v1/categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto)
    }
}
