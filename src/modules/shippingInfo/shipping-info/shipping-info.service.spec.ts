import { Test, TestingModule } from '@nestjs/testing';
import { ShippingInfoService } from './shipping-info.service';

describe('ShippingInfoService', () => {
  let service: ShippingInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingInfoService],
    }).compile();

    service = module.get<ShippingInfoService>(ShippingInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
