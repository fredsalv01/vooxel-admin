import { PartialType } from '@nestjs/mapped-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';

export class UpdateEmergencyContactDto extends PartialType(
  EmergencyContactDto,
) {
  name?: string;

  phone?: string;

  relation?: string;

  workerId?: number;
}
