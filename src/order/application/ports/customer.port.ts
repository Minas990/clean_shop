export const CUSTOMER = Symbol("CUSTOMER");


//it only answers weather the user exist or not 
//can be call to db / Grpc / http , .. 
export interface CustomerPort
{
    exist(customerId:string) : Promise<boolean>
}