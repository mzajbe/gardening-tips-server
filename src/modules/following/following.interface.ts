import { Types } from 'mongoose';

export type TFollower = {
  follower: Types.ObjectId;
  following: Types.ObjectId;
};