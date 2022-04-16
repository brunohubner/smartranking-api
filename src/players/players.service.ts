import { Injectable, Logger } from "@nestjs/common"
import { randomUUID } from "crypto"
import { NotFoundError } from "rxjs"
import { CreatePlayerDto } from "./dto/create-player.dto"
import { UpdatePlayerDto } from "./dto/update-player.dto"
import { Player } from "./interfaces/player.interface"

@Injectable()
export class PlayersService {
    private players: Player[] = []
    private readonly logger = new Logger(PlayersService.name)

    async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const player: Player = {
            _id: randomUUID(),
            ...createPlayerDto,
            ranking: "A",
            rankingPosition: Math.round(Math.random() * 100),
            urlAvatarPlayer: "https://fake.com/fake-url-photo.png"
        }
        this.players.push(player)
        this.logger.log(player)
        return player
    }

    async findAll(): Promise<Player[]> {
        return this.players
    }

    async findById(_id: string): Promise<Player> {
        return this.players.find(player => player._id === _id)
    }

    async findByEmail(email: string): Promise<Player> {
        return this.players.find(player => player.email === email)
    }

    async update(
        _id: string,
        updatePlayerDto: UpdatePlayerDto
    ): Promise<Player> {
        const playerIndex = this.players.findIndex(player => player._id === _id)

        if (playerIndex >= 0) {
            this.players[playerIndex] = {
                ...this.players[playerIndex],
                ...updatePlayerDto
            }
            return this.players[playerIndex]
        }
    }

    async remove(_id: string): Promise<void> {
        this.players = this.players.filter(player => player._id !== _id)
    }
}
