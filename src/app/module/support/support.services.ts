import { Support } from "./support.model";

const createSupport=async(payload:any)=>{
    const response = await Support.create(payload);
    return response;
}

export const SupportService={
    createSupport,
}