import { Schema, model } from 'mongoose';

import { TGroupPost } from './groupPost.interface';

const groupPostSchema = new Schema<TGroupPost>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hide soft-deleted posts by default.
groupPostSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

groupPostSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

const GroupPost = model<TGroupPost>('GroupPost', groupPostSchema);

export default GroupPost;
