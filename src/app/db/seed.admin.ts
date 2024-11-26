import * as argon2 from "argon2";
import { User } from "../module/users/user.model";

export const createAdmin = async () => {
  const hasPassword = await argon2.hash("12345678");
  const data = {
    email: "akonhasan680a@gmail.com",
    fullName:"akonhasan",
    username: "akonhasan",
    password: hasPassword,
    isVerified: true,
    role: "admin"
  };
  const user=await User.findOne({email:data.email,role: "admin"});
  if (!user) {

    const user=  await User.create(data)
    
  }
  
};
