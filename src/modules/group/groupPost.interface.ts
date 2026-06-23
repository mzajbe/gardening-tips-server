import { Types } from 'mongoose';

export type TGroupPost = {
  group: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  image?: string;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
