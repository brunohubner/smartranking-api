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
import { PlayersService } from "./players.service"

@Controller("/api/v1/players")
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() createPlayerDto: CreatePlayerDto) {
        return this.playersService.create(createPlayerDto)
    }

    @Get()
    findAll() {
        return this.playersService.findAll()
    }

    @Get(":param")
    findOne(@Param() { param }: { param: string }) {
        if (validateEmail(param)) {
            return this.playersService.findByEmail(param)
        }
        return this.playersService.findById(param)
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    update(
        @Param() { _id }: { _id: string },
        @Body() updatePlayerDto: UpdatePlayerDto
    ) {
        return this.playersService.update(_id, updatePlayerDto)
    }

    @Delete(":_id")
    remove(@Param() { _id }: { _id: string }) {
        return this.playersService.remove(_id)
    }
}
