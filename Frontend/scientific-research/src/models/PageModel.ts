export default class PageModel {
    pageId: number;
    pageName: string;
    shortDesc: string;
    detail: string;
    userId: number;
    createdAt: string;
    updatedAt: string;

    constructor(
        pageId: number,
        pageName: string,
        shortDesc: string,
        detail: string,
        userId: number,
        createdAt: string,
        updatedAt: string,
    ) {
        this.pageId = pageId;
        this.pageName = pageName;
        this.shortDesc = shortDesc;
        this.detail = detail;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}