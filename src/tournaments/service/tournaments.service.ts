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

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
      relations: ['matches', 'category'],
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    return tournament;
  }

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create({
      name: createTournamentDto.name,
      country: createTournamentDto.country,
      city: createTournamentDto.city,
      date: new Date(createTournamentDto.date),
      categoryId: createTournamentDto.categoryId ?? null,
      description: createTournamentDto.description ?? null,
    });
    return this.tournamentsRepository.save(tournament);
  }

  async update(
    id: number,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    const tournament = await this.findOne(id);

    if (updateTournamentDto.date !== undefined) {
      tournament.date = new Date(updateTournamentDto.date);
    }

    Object.assign(tournament, updateTournamentDto);

    return this.tournamentsRepository.save(tournament);
  }

  async remove(id: number): Promise<void> {
    const tournament = await this.findOne(id);
    await this.tournamentsRepository.remove(tournament);
  }
}
