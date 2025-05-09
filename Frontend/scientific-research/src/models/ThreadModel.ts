export default class ThreadModel {
    threadId: number;
    threadCatId: number;
    userId: number;
    shortQuestion: string;
    detailQuestion: string;
    views: number;
    replies: number;
    votes: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;

    constructor(
        threadId: number,
        threadCatId: number,
        userId: number,
        shortQuestion: string,
        detailQuestion: string,
        views: number,
        replies: number,
        votes: number,
        status: boolean,
        createdAt: string,
        updatedAt: string,
    ) {
        this.threadId = threadId;
        this.threadCatId = threadCatId;
        this.userId = userId;
        this.shortQuestion = shortQuestion;
        this.detailQuestion = detailQuestion;
        this.views = views;
        this.votes = votes;
        this.replies = replies;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}