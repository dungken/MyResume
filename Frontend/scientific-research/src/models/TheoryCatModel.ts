
export default class TheoryCatModel {
    theoryCatId: number;
    theoryParentCatId: number;
    userId: number;
    name: string;
    shortDesc: string;
    createdAt: string;
    updatedAt: string;

    constructor(
        theoryCatId: number,
        theoryParentCatId: number,
        userId: number,
        name: string,
        shortDesc: string,
        createdAt: string,
        updatedAt: string,
    ) {
        this.theoryCatId = theoryCatId;
        this.theoryParentCatId = theoryParentCatId;
        this.userId = userId;
        this.name = name;
        this.shortDesc = shortDesc;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}