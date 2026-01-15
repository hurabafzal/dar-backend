import { Test, TestingModule } from '@nestjs/testing';
import { ComponentPriceController } from './component-price.controller';

describe('ComponentPriceController', () => {
  let controller: ComponentPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentPriceController],
    }).compile();

    controller = module.get<ComponentPriceController>(ComponentPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
