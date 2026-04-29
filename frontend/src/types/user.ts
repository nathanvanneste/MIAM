export type User = {
    UserID: number;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    pseudo: string;
    createdAt: string;
};

export type LoginDTO = {
    email: string;
    password: string;
}

export type RegisterDTO = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    pseudo: string;
}