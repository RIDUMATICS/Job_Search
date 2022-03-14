import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sites' })
export class Site {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  path: string;

  @Column({ default: false })
  hasApplied: boolean;

  @Column({ type: 'json', nullable: true, default: [] })
  ignoredKeywords: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
