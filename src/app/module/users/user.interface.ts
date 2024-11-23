export interface IUser {
    id?: string;
    email: string;
    username: string;
    password: string;
    role: 'admin' | 'user'|"superAdmin";
    isVerified:boolean;
    profileImage:string;
    createdAt: Date;
    updatedAt: Date;
  
}


