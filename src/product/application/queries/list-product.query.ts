export class ListProductQuery
{
    constructor(
        public readonly isActive?: boolean,
        public readonly minPrice?: number,
        public readonly maxPrice?: number
    ) {} 

}