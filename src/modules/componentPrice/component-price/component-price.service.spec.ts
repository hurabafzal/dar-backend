import { Test, TestingModule } from '@nestjs/testing';
import { ComponentPriceService } from './component-price.service';

describe('ComponentPriceService', () => {
  let service: ComponentPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentPriceService],
    }).compile();

    service = module.get<ComponentPriceService>(ComponentPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
