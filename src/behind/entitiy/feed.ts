import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface IFeed {
  url: string;
}

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public url!: string;
}