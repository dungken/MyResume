export default class TheoryModel {
    theoryDetailId: number;
    theoryCatId: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;

    constructor(
        theoryDetailId: number,
        theoryCatId: number,
        title: string,
        content: string,
        userId: number,
        createdAt: string,
        updatedAt: string,
    ) {
        this.theoryDetailId = theoryDetailId;
        this.theoryCatId = theoryCatId;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}