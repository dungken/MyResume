export default class ThreadCommentModel {
    commentId: number;
    commentParentId: number;
    userId: number;
    threadId: number;
    level: number;
    comment: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;

    constructor(
        commentId: number,
        commentParentId: number,
        userId: number,
        threadId: number,
        level: number, 
        comment: string,
        status: boolean,
        createdAt: string,
        updatedAt: string,
    ) {
        this.commentId = commentId;
        this.commentParentId = commentParentId;
        this.userId = userId;
        this.threadId = threadId;
        this.comment = comment;
        this.level = level;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}