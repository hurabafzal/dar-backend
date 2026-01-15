import { Test, TestingModule } from '@nestjs/testing';
import { BlockDatesController } from './block-dates.controller';

describe('BlockDatesController', () => {
  let controller: BlockDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockDatesController],
    }).compile();

    controller = module.get<BlockDatesController>(BlockDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
