import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CreatePlayerDto } from "./dto/create-player.dto"
import { UpdatePlayerDto } from "./dto/update-player.dto"
import { Player } from "./interfaces/player.interface"
import { Model } from "mongoose"

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel("Player") private readonly playerModel: Model<Player>
    ) {}

    async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const player = new this.playerModel(createPlayerDto)
        await player.save()
        return player
    }

    async findAll(): Promise<Player[]> {
        return this.playerModel.find()
    }

    async findById(_id: string): Promise<Player> {
        return this.playerModel.findById(_id)
    }

    async findByEmail(email: string): Promise<Player> {
        return this.playerModel.findOne({ email })
    }

    async update(
        _id: string,
        updatePlayerDto: UpdatePlayerDto
    ): Promise<Player> {
        const player = await this.playerModel.findByIdAndUpdate(
            _id,
            updatePlayerDto
        )
        for (const key in updatePlayerDto) {
            player[key] = updatePlayerDto[key]
        }
        return player
    }

    async remove(_id: string): Promise<void> {
        return this.playerModel.findByIdAndDelete(_id)
    }
}
