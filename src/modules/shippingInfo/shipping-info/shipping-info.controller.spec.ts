import { Test, TestingModule } from '@nestjs/testing';
import { ShippingInfoController } from './shipping-info.controller';

describe('ShippingInfoController', () => {
  let controller: ShippingInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingInfoController],
    }).compile();

    controller = module.get<ShippingInfoController>(ShippingInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
