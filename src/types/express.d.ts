declare namespace Express {

    export interface Request {
        transactionId?: string; 
    }


    export interface RequestBody {
        message: string;
        to: string;
        from: string;
        timeToLifeSec: number;
    }
}