import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Photo extends Model {
  @Column({
    type: DataType.STRING,
  })
  telegram_id: number;

  @Column({
    type: DataType.STRING
  })
  photo_id: string;
}