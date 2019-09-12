import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Settings {
  @ObjectIdColumn()
  public id!: ObjectID;

  @Column()
  name!: string;

  @Column()
  value!: string;
}