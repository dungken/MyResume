export default class PostCatModel {
    postCatId: number;
    postCatParentId: number;
    postCatName: string;
    desc: string;
    createdAt: string;
    updatedAt: string;

    constructor(postCatId: number,
        postCatParentId: number,
        postCatName: string,
        desc: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.postCatId = postCatId;
        this.postCatParentId = postCatParentId;
        this.postCatName = postCatName;
        this.desc = desc;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}