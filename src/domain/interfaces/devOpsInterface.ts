//interface para dar formato a la respuesta y a lo que viene

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
