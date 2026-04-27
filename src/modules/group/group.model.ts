import { Schema, model } from 'mongoose';
import { TGroup } from './group.interface';

const groupSchema = new Schema<TGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Soft delete middleware
groupSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

groupSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

const Group = model<TGroup>('Group', groupSchema);

export default Group;
