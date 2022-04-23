import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Category } from "./interfaces/category.interface"
import { Model } from "mongoose"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"
import { PlayersService } from "src/players/players.service"

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("Category")
        private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService
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

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().populate("players")
    }

    async findById(_id: string): Promise<Category> {
        const category = await this.categoryModel
            .findById(_id)
            .populate("players")
        if (!category) {
            throw new NotFoundException(
                `The category with ID ${_id} do not exists.`
            )
        }
        return category
    }

    async findByName(category_name: string): Promise<Category> {
        const category = await this.categoryModel.findOne({
            name: category_name
        })

        if (!category) throw new NotFoundException("Category not found.")
        return category
    }

    async findCategoryOfPlayer(player_id: any): Promise<Category> {
        const [_player, category] = await Promise.all([
            this.playersService.findById(player_id),
            this.categoryModel.findOne().where("players").in(player_id)
        ])
        return category
    }

    async update(
        _id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<Category> {
        const category = await this.findById(_id)

        if (updateCategoryDto?.description) {
            category.description = updateCategoryDto.description
        }
        updateCategoryDto?.events?.length &&
            category.events.push(...updateCategoryDto.events)

        await category.save()
        return category
    }

    async addPlayerToCategory(params: object): Promise<Category> {
        const category_name = params["category_name"]
        const player_id = params["player_id"]

        const [categoryExists, playerAlreadyRegisteredInCategory] =
            await Promise.all([
                this.categoryModel.findOne({ name: category_name }),
                this.categoryModel
                    .find({ name: category_name })
                    .where("players")
                    .in(player_id),
                this.playersService.findById(player_id)
            ])

        if (!categoryExists) throw new NotFoundException("Category not found.")
        if (playerAlreadyRegisteredInCategory.length > 0) {
            throw new BadRequestException(
                `Player ${player_id} already registred in category ${category_name}.`
            )
        }

        categoryExists.players.push(player_id)
        return categoryExists.save()
    }
}
