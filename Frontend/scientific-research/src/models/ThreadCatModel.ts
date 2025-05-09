export default class ThreadCatModel {
    threadCatId: number;
    name: string;
    description: string;
    userId: number;
    createdAt: string;
    updatedAt: string;

    constructor(
        threadCatId: number,
        name: string,
        description: string,
        userId: number,
        createdAt: string,
        updatedAt: string,
    ) {
        this.threadCatId = threadCatId;
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}