import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    type: DataType.TEXT,
    unique: true
  })
  telegram_id: string;

  @Column({
    type: DataType.STRING
  })
  fullname: string;

  @Column({
    type: DataType.STRING,
    unique: true
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    unique: true
  })
  username: string
}