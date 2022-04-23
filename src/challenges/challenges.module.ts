import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoriesModule } from "src/categories/categories.module"
import { PlayersModule } from "src/players/players.module"
import { ChallengesController } from "./challenges.controller"
import { ChallengesService } from "./challenges.service"
import { ChallengeSchema } from "./interfaces/chalenge.schema"
import { MatchSchema } from "./interfaces/match.schema"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Challenge", schema: ChallengeSchema },
            { name: "Match", schema: MatchSchema }
        ]),
        CategoriesModule,
        PlayersModule
    ],
    controllers: [ChallengesController],
    providers: [ChallengesService]
})
export class ChallengesModule {}
