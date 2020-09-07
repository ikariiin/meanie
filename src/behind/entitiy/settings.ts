import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  name!: string;

  @Column()
  value!: string;
}