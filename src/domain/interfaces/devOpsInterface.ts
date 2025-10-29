

export interface MessagePayload {
    message: string;
    to: string; 
    from: string;
    timeToLifeSec: number;
}

export interface MessageResponse {
    message: string;
    newJwt?: string;
}

