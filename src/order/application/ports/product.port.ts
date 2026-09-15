export const PRODUCT = Symbol("PRODUCT");


//it only answers weather the user exist or not 
//can be call to db / Grpc / http , .. 
export interface ProductPort
{
    exist(productId:string) : Promise<boolean>
}