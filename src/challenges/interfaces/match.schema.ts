import * as mongoose from "mongoose"

export const MatchSchema = new mongoose.Schema(
    {
        category: { type: String, required: true },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
                required: true
            }
        ],
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true
        },
        result: [
            {
                set: { type: String, required: true }
            }
        ]
    },
    {
        timestamps: true,
        collection: "matches",
        toJSON: {
            transform(_, ret): void {
                delete ret.__v
            }
        }
    }
)
