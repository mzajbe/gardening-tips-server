import { Schema, model } from 'mongoose';
import { TPost } from './posts.interface';


const postSchema = new Schema<TPost>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categories: {
    type: [String],
    required: true,
    enum: ['Vegetables', 'Flowers', 'Landscaping', 'Others'], // Can extend categories here
  },
  images: {
    type: [String],
    default: [],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt fields
});

// Soft delete middleware
postSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

const Post = model<TPost>('Post', postSchema);

export default Post;
