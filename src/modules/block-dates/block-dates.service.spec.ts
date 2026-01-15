import { Test, TestingModule } from '@nestjs/testing';
import { BlockDatesService } from './block-dates.service';

describe('BlockDatesService', () => {
  let service: BlockDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockDatesService],
    }).compile();

    service = module.get<BlockDatesService>(BlockDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
