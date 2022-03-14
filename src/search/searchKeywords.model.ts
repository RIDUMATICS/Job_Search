import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'searchKeywords' })
class SearchKeywords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  keyword: string;
}

export default SearchKeywords;
