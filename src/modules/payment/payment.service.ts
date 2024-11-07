import User from "../user/user.model";

const confirmationService = async (userId: string) => {
  if(!userId) throw new Error("User ID not found");

  const user = await User.findByIdAndUpdate(
    userId,
    { isPremium: true },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
};

export const paymentServices = {
  confirmationService,
};
