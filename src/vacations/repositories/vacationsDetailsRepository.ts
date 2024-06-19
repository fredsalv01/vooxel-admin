import { InjectRepository } from "@nestjs/typeorm";
import { VacationDetail } from "../entities/vacationDetail.entity";
import { DataSource, Repository } from "typeorm";
import { Logger } from "@nestjs/common";
import { CreateVacationsDetailsDto } from "../dto/create-vacation-detail.dto";

export class VacationsDetailsRepository {
  private readonly logger = new Logger(VacationsDetailsRepository.name);
  constructor(
    @InjectRepository(VacationDetail)
    private readonly db: Repository<VacationDetail>,
    private readonly dataSource: DataSource
  ) {}

  async createVacationDetail(vacationDetail: CreateVacationsDetailsDto): Promise<VacationDetail> {
    try {
      const newVacationDetail = this.db.create(vacationDetail);

      const result = await this.db.save(newVacationDetail);

      this.logger.debug(
        `${this.createVacationDetail.name} - result`,
        JSON.stringify(result, null, 2)
      );

      return result;

    } catch (error) {
      this.logger.error('ERROR GUARDANDO DETALLE DE VACACION:', error);
      throw new Error(error);
    }
  }


}