import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Chat } from '../../chats/models/chat.model'; // Chat modelini import qilamiz

@Table({ tableName: 'messages' })
export class Message extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'user',
  })
  role: string;

  @ForeignKey(() => Chat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chat_id: string;

  @BelongsTo(() => Chat)
  chat: Chat;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}