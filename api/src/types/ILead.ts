import { RowDataPacket } from 'mysql2';

export interface ILead extends RowDataPacket {
  id: number;
  category: string;
  status: string;
  price: string;
}
