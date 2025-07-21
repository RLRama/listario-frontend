export interface UserResponse {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: number;
    title: string;
    content: string;
    completed: boolean;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}