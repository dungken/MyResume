export default interface JwtPayload {
    userId: number;
    username: string;
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

