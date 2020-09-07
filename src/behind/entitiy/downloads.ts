import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { DownloadDetails } from "./download-details";

@Entity()
export class Downloads {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public feedURL!: string;

  @OneToOne(type => DownloadDetails, { onDelete: "CASCADE", cascade: true })
  @JoinColumn()
  public details!: DownloadDetails;

  @Column()
  public fsLink!: string;
}