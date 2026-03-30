import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class PhotoTemplate extends Model {
  @Column({
    type: DataType.STRING,
  })
  prompt: string

  @Column({
    type: DataType.STRING
  })
  title: string;

  @Column({
    type: DataType.STRING
  })
  subtitle: string;

  @Column({
    type: DataType.STRING
  })
  before_img: string;

  @Column({
    type: DataType.STRING
  })
  after_img: string
}