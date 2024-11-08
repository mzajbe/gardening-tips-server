import mongoose, { Schema } from "mongoose";
import { TFavourite } from "./favourite.interface";

type FavouriteDocument = TFavourite & Document;

const FavouriteSchema: Schema<FavouriteDocument> = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Ensuring that a user can only favorite a post once (unique constraint on userId and postId)
FavouriteSchema.index({ postId: 1, userId: 1 }, { unique: true });

const FavouriteModel = mongoose.model<FavouriteDocument>("Favourite", FavouriteSchema);

export default FavouriteModel;
