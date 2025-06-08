export interface Task {
    _id: string;
    title: string;
    completed: boolean;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    taskId: string;
    text: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface RouteParams {
    id: string;
    title: string;
} 