export default class ThreadImageModel {
    imgId: number;
    name: string;
    path: string;
    threadId: number;
    createdAt: string;
    updatedAt: string;

    constructor(
        imgId: number,
        name: string,
        path: string,
        threadId: number,
        createdAt: string,
        updatedAt: string,
    ) {
        this.imgId = imgId;
        this.name = name;
        this.path = path;
        this.threadId = threadId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}