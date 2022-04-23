import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { validateEmail } from "src/helpers/validateEmail"
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"
import { Player } from "./interfaces/player.interface"
import { PlayersService } from "./players.service"

@Controller("api/v1/players")
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
        return this.playersService.create(createPlayerDto)
    }

    @Get()
    async findAll(): Promise<Player[]> {
        return this.playersService.findAll()
    }

    @Get(":param")
    async findOne(@Param("param") param: string): Promise<Player> {
        if (validateEmail(param)) {
            return this.playersService.findByEmail(param)
        }
        return this.playersService.findById(param)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body() updatePlayerDto: UpdatePlayerDto
    ): Promise<Player> {
        return this.playersService.update(_id, updatePlayerDto)
    }

    @Delete(":_id")
    async remove(@Param("_id") _id: string): Promise<Player> {
        return this.playersService.remove(_id)
    }
}
