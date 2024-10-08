import {Types } from 'mongoose';

export type TPost = {
  title: string;
  content: string;
  author: Types.ObjectId;
  categories: string[]; 
  images: string[]; 
  isPremium: boolean;
  isDeleted: boolean;
}

export type TPostUpdate = {
  title?: string;
  content?: string;
  categories?: string[];
  images?: string[];
  isPremium?: boolean;
  isDeleted?: boolean;
}
