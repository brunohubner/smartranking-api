import * as mongoose from "mongoose"

export const ChallengeSchema = new mongoose.Schema(
    {
        dateTimeChallenge: { type: Date, required: true },
        status: String,
        dateTimeRequest: Date,
        dateTimeResponse: Date,
        challenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true
        },
        category: String,
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
                required: true
            }
        ],
        match: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Match",
                required: true
            }
        ]
    },
    {
        timestamps: true,
        collection: "challenges",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
