export type User = {
    UserID: number;
    email: string;
    firstName: string;
    lastName: string;
    avatarUri?: string;
    pseudo: string;
    createdAt: string;
};

export type LoginDTO = {
    emailOrPseudo: string;
    password: string;
}

export type RegisterDTO = {
    email: string;
    password: string; // Il faut ?
    firstName: string;
    lastName: string;
    pseudo: string;
    avatarUri?: string;
}