import httpStatus from 'http-status-codes';

import AppError from '../../error/AppError';
import GroupPost from './groupPost.model';
import Group from './group.model';

const createGroupPost = async (
  groupId: string,
  userId: string,
  payload: { content: string },
  imagePath?: string
) => {
  const content = payload.content?.trim();

  if (!content) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post text is required');
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const isMember = group.members.some((member) => member.toString() === userId);

  if (!isMember) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only group members can create posts');
  }

  const createdPost = await GroupPost.create({
    group: groupId,
    author: userId,
    content,
    image: imagePath || '',
  });

  return GroupPost.findById(createdPost._id)
    .populate('author', 'name email profilePicture')
    .populate('group', 'name');
};

const getGroupPosts = async (groupId: string, viewerId?: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const isAdmin = viewerId ? group.admin.toString() === viewerId : false;

  const filters: Record<string, unknown> = { group: groupId };

  if (!isAdmin) {
    filters.isDisabled = false;
  }

  return GroupPost.find(filters)
    .populate('author', 'name email profilePicture')
    .sort({ createdAt: -1 });
};

const setGroupPostDisabled = async (
  groupId: string,
  postId: string,
  adminUserId: string,
  disabled: boolean
) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.admin.toString() !== adminUserId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only group admin can moderate posts');
  }

  const post = await GroupPost.findOneAndUpdate(
    { _id: postId, group: groupId },
    { isDisabled: disabled },
    { new: true }
  ).populate('author', 'name email profilePicture');

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found in this group');
  }

  return post;
};

const deleteGroupPost = async (groupId: string, postId: string, adminUserId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.admin.toString() !== adminUserId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only group admin can delete posts');
  }

  const post = await GroupPost.findOneAndUpdate(
    { _id: postId, group: groupId },
    { isDeleted: true },
    { new: true }
  );

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found in this group');
  }

  return post;
};

const getGroupPostsByUser = async (userId: string) => {
  return GroupPost.find({ author: userId, isDisabled: false })
    .populate('group', 'name')
    .populate('author', 'name email profilePicture')
    .sort({ createdAt: -1 });
};

export const GroupPostService = {
  createGroupPost,
  getGroupPosts,
  setGroupPostDisabled,
  deleteGroupPost,
  getGroupPostsByUser,
};
