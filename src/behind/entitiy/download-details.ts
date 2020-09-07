import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class DownloadDetails {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public torrentLink!: string;

  @Column()
  public pageLink!: string;

  @Column()
  public date!: string;

  @Column()
  public seeders!: number;

  @Column()
  public leechers!: number;

  @Column()
  public size!: string;
}