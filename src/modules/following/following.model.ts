import { Schema, model } from 'mongoose';
import { TFollower } from './following.interface';


const followerSchema = new Schema<TFollower>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Unique constraint to prevent duplicate follow entries
followerSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follower = model<TFollower>('Follower', followerSchema);

export default Follower;