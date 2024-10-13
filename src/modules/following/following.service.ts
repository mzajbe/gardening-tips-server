import Follower from "./following.model";


// Create a new follow relationship
const followUser = async (followerId: string, followingId: string) => {
  const newFollower = await Follower.create({
    follower: followerId,
    following: followingId,
  });
  return newFollower;
};

// Remove a follow relationship (Unfollow)
const unfollowUser = async (followerId: string, followingId: string) => {
  const result = await Follower.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });
  return result;
};

// Get the list of users following a particular user
const getFollowers = async (userId: string) => {
  const followers = await Follower.find({ following: userId })
    .populate("follower", "name");
  return followers;
};

// Get the list of users that a user is following
const getFollowing = async (userId: string) => {
  const following = await Follower.find({ follower: userId })
    .populate("following", "name");
  return following;
};

export const FollowerService = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
