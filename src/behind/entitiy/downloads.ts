import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";

@Entity()
export class Downloads {
  @ObjectIdColumn()
  public id!: ObjectID;

  @Column()
  public feedURL!: string;

  @Column()
  public details!: FeedResult;

  @Column()
  public fsLink!: string;
}