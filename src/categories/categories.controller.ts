import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"
import { Category } from "./interfaces/category.interface"

@Controller("api/v1/categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @Body() createCategoryDto: CreateCategoryDto
    ): Promise<Category> {
        return this.categoriesService.create(createCategoryDto)
    }

    @Get()
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll()
    }

    @Get(":_id")
    async findOne(@Param("_id") _id: string): Promise<Category> {
        return this.categoriesService.findById(_id)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<Category> {
        return this.categoriesService.update(_id, updateCategoryDto)
    }

    @Post(":category_name/players/:player_id")
    @UsePipes(ValidationPipe)
    async addPlayerToCategory(@Param() params: object): Promise<Category> {
        return this.categoriesService.addPlayerToCategory(params)
    }
}
