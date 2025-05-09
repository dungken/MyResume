import PostCatModel from "./PostCatModel";

export default class PostModel {
    postId: number;
    title: string;
    desc: string;
    detail: string;
    thumbnail: string;
    postCatId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;

    constructor(
        postId: number,
        title: string,
        desc: string,
        detail: string,
        thumbnail: string,
        postCatId: number,
        userId: number,
        createdAt: string,
        updatedAt: string
    ) {
        this.postId = postId;
        this.title = title;
        this.desc = desc;
        this.detail = detail;
        this.thumbnail = thumbnail;
        this.postCatId = postCatId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}