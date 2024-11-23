export interface IUser {
    id?: string;
    email: string;
    username: string;
    password: string;
    fullName: string;
    role: 'admin' | 'user'|"superAdmin";
    isVerified:boolean;
    profileImage:string;

}


