import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from './schemas/appointments.schema';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { toObjectId } from 'src/shared/helper/helper';
import {
  District,
  DistrictDocument,
} from 'src/modules/district/schemas/district.schema';
import {
  BlockDate,
  BlockDateDocument,
} from 'src/modules/block-dates/schemas/block-date.schema';
import { AppointmentType } from 'src/shared/enums/appointments.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    @InjectModel(BlockDate.name)
    private blockDateModel: Model<BlockDateDocument>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    let isBlocked = false;
    const conflictingBlockDate = await this.blockDateModel
      .findOne({
        date: new Date(createAppointmentDto.appointmentStartTime),
      })
      .exec();

    if (conflictingBlockDate) {
      isBlocked =
        (createAppointmentDto.type === AppointmentType.DELIVERY &&
          conflictingBlockDate.delivery) ||
        (createAppointmentDto.type === AppointmentType.MEASUREMENT &&
          conflictingBlockDate.measurement) ||
        (createAppointmentDto.type === AppointmentType.DESIGN &&
          conflictingBlockDate.design);
    }

    if (isBlocked) {
      throw new BadRequestException(
        `Cannot create appointment. The selected time is blocked for ${createAppointmentDto.type}.`,
      );
    }

    const appointment = await this.appointmentModel.findOne({
      appointmentStartTime: { $lte: createAppointmentDto.appointmentStartTime },
      appointmentEndTime: { $gte: createAppointmentDto.appointmentEndTime },
      customerId: createAppointmentDto.customerId,
    });

    if (appointment) {
      throw new BadRequestException(
        `Appointment already exists at this time for user: ${createAppointmentDto.customerId}.`,
      );
    }

    let createdAppointment = new this.appointmentModel(createAppointmentDto);
    const result = await this.districtModel
      .findOne(toObjectId(createAppointmentDto.districtId))
      .exec();
    createdAppointment.governorateId = result['_id'] as ObjectId;
    if(createdAppointment.type == "DESIGN")createdAppointment.orderId = new Types.ObjectId(createdAppointment.designDetails.invoiceId);
    return createdAppointment.save();
  }

  async findAll(): Promise<any[]> {
    const appointments = await this.appointmentModel
      .find()
      .populate('districtId governorateId')
      .lean()
      .exec();

    return appointments;
  }

  async findCustomerAppointments(id: string): Promise<any> {
    const appointments = await this.appointmentModel
      .find({ customerId: toObjectId(id) })
      .populate('districtId governorateId customerId')
      .lean()
      .exec();

    return appointments;
  }

  async findOne(id: string): Promise<any> {
    const appointment = await this.appointmentModel
      .findById(toObjectId(id))
      .populate({
        path: 'governorateId districtId customerId',
      })
      .lean()
      .exec();

    return appointment;
  }

  async findByType(type: AppointmentType): Promise<any> {
    const appointment = await this.appointmentModel
      .find({ type })
      .populate('customerId orderId')
      .lean()
      .exec();

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    const governorate = await this.districtModel
      .findOne(toObjectId(updateAppointmentDto.districtId))
      .lean()
      .exec();

    if (!governorate) {
      throw new NotFoundException(
        `Governorate not found for district ID ${updateAppointmentDto.districtId}`,
      );
    }

    // Check for conflicting block dates if start or end time is being updated
    if (
      updateAppointmentDto.appointmentStartTime ||
      updateAppointmentDto.appointmentEndTime
    ) {
      const existingAppointment = await this.appointmentModel
        .findById(id)
        .lean()
        .exec();
      if (!existingAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      const startTime =
        updateAppointmentDto.appointmentStartTime ||
        existingAppointment.appointmentStartTime;
      const endTime =
        updateAppointmentDto.appointmentEndTime ||
        existingAppointment.appointmentEndTime;
      const appointmentType =
        updateAppointmentDto.type || existingAppointment.type;

      const conflictingBlockDate = await this.blockDateModel
        .findOne({
          startTime: { $lte: startTime },
          endTime: { $gte: endTime },
          $or: [
            {
              design: true,
              ...(appointmentType === AppointmentType.DESIGN && {
                design: true,
              }),
            },
            {
              measurement: true,
              ...(appointmentType === AppointmentType.MEASUREMENT && {
                measurement: true,
              }),
            },
            {
              delivery: true,
              ...(appointmentType === AppointmentType.DELIVERY && {
                delivery: true,
              }),
            },
          ],
        })
        .exec();

      if (conflictingBlockDate) {
        throw new BadRequestException(
          `Cannot update appointment. The selected time is blocked for ${appointmentType}.`,
        );
      }
    }
    const updateOperation = {
      ...updateAppointmentDto,
      governorateId: governorate.governorateId,
    };
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(toObjectId(id), updateOperation, { new: true })
      .lean()
      .exec();

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return updatedAppointment;
  }

  async remove(id: string) {
    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(toObjectId(id))
      .exec();
    if (!deletedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return deletedAppointment;
  }
}
