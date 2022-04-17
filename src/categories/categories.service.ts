import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Category } from "./interfaces/category.interface"
import { Model } from "mongoose"
import { CreateCategoryDto } from "./dtos/categories.dto"

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("Category") private readonly categoryModel: Model<Category>
    ) {}

    async create({
        description,
        events,
        name
    }: CreateCategoryDto): Promise<Category> {
        const categoryExists = await this.categoryModel.findOne({ name })
        if (categoryExists) {
            throw new BadRequestException(
                `Category ${name} already registered.`
            )
        }
        const category = new this.categoryModel({
            description,
            events,
            name
        })
        await category.save()
        return category
    }
}
