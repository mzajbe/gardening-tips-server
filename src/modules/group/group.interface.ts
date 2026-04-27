import { Types } from 'mongoose';

export type TGroup = {
  name: string;
  description: string;
  coverImage?: string;
  admin: Types.ObjectId;
  members: Types.ObjectId[];
  isDeleted: boolean;
};
