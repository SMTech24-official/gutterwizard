export interface ISupports{
    name: string;
    email: string;
    phone: string;
    status: 'pending' | 'resolved' ; 
    message: string;
}