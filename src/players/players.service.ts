import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"
import { Player } from "./interfaces/player.interface"
import { Model } from "mongoose"

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel("Player") private readonly playerModel: Model<Player>
    ) {}

    async create({
        email,
        name,
        phoneNumber
    }: CreatePlayerDto): Promise<Player> {
        const playerExists = await this.playerModel.findOne({
            $or: [{ email }, { phoneNumber }]
        })
        if (playerExists) {
            throw new BadRequestException(
                `There is already a player using this email or phone number.`
            )
        }
        const player = new this.playerModel({
            email,
            name,
            phoneNumber
        })
        await player.save()
        return player
    }

    async findAll(): Promise<Player[]> {
        return this.playerModel.find()
    }

    async findById(_id: string): Promise<Player> {
        const player = await this.playerModel.findById(_id)
        if (!player) throw new NotFoundException("Player not found.")
        return player
    }

    async findByEmail(email: string): Promise<Player> {
        const player = await this.playerModel.findOne({ email })
        if (!player) throw new NotFoundException("Player not found.")
        return player
    }

    async update(
        _id: string,
        updatePlayerDto: UpdatePlayerDto
    ): Promise<Player> {
        const [player, emailDuplicated, phoneNumberDuplicated] =
            await Promise.all([
                this.playerModel.findById(_id),
                this.playerModel.findOne({ email: updatePlayerDto?.email }),
                this.playerModel.findOne({
                    phoneNumber: updatePlayerDto?.phoneNumber
                })
            ])
        if (!player) throw new NotFoundException("Player not found.")
        if (
            updatePlayerDto?.email &&
            _id !== emailDuplicated?._id.toString() &&
            updatePlayerDto.email === emailDuplicated?.email
        ) {
            throw new BadRequestException(
                `There is already a player using the email ${updatePlayerDto.email}.`
            )
        }
        if (
            updatePlayerDto?.phoneNumber &&
            _id !== phoneNumberDuplicated?._id.toString() &&
            updatePlayerDto.phoneNumber === phoneNumberDuplicated?.phoneNumber
        ) {
            throw new BadRequestException(
                `There is already a player using the phone number ${updatePlayerDto.phoneNumber}.`
            )
        }
        for (const key in updatePlayerDto) {
            player[key] = updatePlayerDto[key]
        }
        await player.save()
        return player
    }

    async remove(_id: string): Promise<Player> {
        try {
            const player = await this.playerModel.findById(_id)
            if (!player) throw new NotFoundException("Player not found.")
            return this.playerModel.findByIdAndDelete(_id)
        } catch {
            //
        }
    }
}
