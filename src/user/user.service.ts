import { UserModel } from "./user.model";
import { IUser } from "./user.model";

export const createUser = (input: Partial<IUser>) => {
  return UserModel.create(input);
};

export const queryUser = (
  query: Partial<IUser>,
  type: "single" | "multiple"
) => {
  if (type === "single") {
    return UserModel.findOne(query);
  } else {
    return UserModel.find(query);
  }
};

export const getUserById = (id: string) => UserModel.findById(id);

export const updateUser = (id: string, input: Partial<IUser>) =>
  UserModel.findByIdAndUpdate(id, input, { new: true });

export const deleteUser = (id: string) => UserModel.findByIdAndDelete(id);
