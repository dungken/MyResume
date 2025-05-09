export default class TheoryKeywordModel {
    keywordId: number;
    theoryExample: number;
    userId: number;
    keyword: string;
    createdAt: string;
    updatedAt: string;

    constructor(
        keywordId: number,
        theoryExample: number,
        keyword: string,
        userId: number,
        createdAt: string,
        updatedAt: string,
    ) {
        this.keywordId = keywordId;
        this.theoryExample = theoryExample;
        this.keyword = keyword;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}