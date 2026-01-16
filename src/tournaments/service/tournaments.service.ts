import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entity/tournament.entity';
import { CreateTournamentDto } from '../dto/create-tournament.dto';
import { UpdateTournamentDto } from '../dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({
      relations: ['matches'],
    });
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
      relations: ['matches'],
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    return tournament;
  }

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create({
      ...createTournamentDto,
      startDate: createTournamentDto.startDate
        ? new Date(createTournamentDto.startDate)
        : null,
      endDate: createTournamentDto.endDate
        ? new Date(createTournamentDto.endDate)
        : null,
    });
    return this.tournamentsRepository.save(tournament);
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    const tournament = await this.findOne(id);

    if (updateTournamentDto.startDate !== undefined) {
      tournament.startDate = updateTournamentDto.startDate
        ? new Date(updateTournamentDto.startDate)
        : null;
    }

    if (updateTournamentDto.endDate !== undefined) {
      tournament.endDate = updateTournamentDto.endDate
        ? new Date(updateTournamentDto.endDate)
        : null;
    }

    Object.assign(tournament, {
      ...updateTournamentDto,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
    });

    return this.tournamentsRepository.save(tournament);
  }

  async remove(id: string): Promise<void> {
    const tournament = await this.findOne(id);
    await this.tournamentsRepository.remove(tournament);
  }
}
