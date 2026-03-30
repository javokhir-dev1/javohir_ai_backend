import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'chats' })
export class Chat extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
  })
  chat_title: string;
}