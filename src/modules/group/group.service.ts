import AppError from '../../error/AppError';
import httpStatus from 'http-status-codes';
import Group from './group.model';

const createGroup = async (payload: { name: string; description: string; admin: string }) => {
  const group = await Group.create({
    ...payload,
    members: [payload.admin],
  });
  return group;
};

const getAllGroups = async () => {
  const result = await Group.find()
    .populate('admin', 'name email profilePicture')
    .populate('members', 'name email profilePicture');
  return result;
};

const getGroupById = async (groupId: string) => {
  const result = await Group.findById(groupId)
    .populate('admin', 'name email profilePicture')
    .populate('members', 'name email profilePicture');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  return result;
};

const joinGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  // Check if user is already a member
  const isMember = group.members.some(
    (memberId) => memberId.toString() === userId
  );

  if (isMember) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are already a member of this group');
  }

  group.members.push(userId as any);
  await group.save();

  return group;
};

const leaveGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  // Admin cannot leave
  if (group.admin.toString() === userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Admin cannot leave the group. Delete the group instead.');
  }

  // Check if user is a member
  const isMember = group.members.some(
    (memberId) => memberId.toString() === userId
  );

  if (!isMember) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not a member of this group');
  }

  group.members = group.members.filter(
    (memberId) => memberId.toString() !== userId
  );
  await group.save();

  return group;
};

const deleteGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.admin.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only the admin can delete this group');
  }

  group.isDeleted = true;
  await group.save();

  return group;
};

export const GroupService = {
  createGroup,
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  deleteGroup,
};
