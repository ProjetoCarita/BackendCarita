export interface Usuario{
    id?: number,
    email: string,
    cpf: string,
    senha?:string,
    status: boolean,
    role?: string,
    createdAt: Date,
    updatedAt: Date
  }