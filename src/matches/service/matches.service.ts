import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entity/match.entity';
import { Tournament } from '../../tournaments/entity/tournament.entity';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchesRepository.find({
      relations: ['tournament', 'statistics'],
    });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['tournament', 'statistics'],
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    // Verificar que el torneo exista si se proporciona
    if (createMatchDto.tournamentId) {
      const tournament = await this.tournamentsRepository.findOne({
        where: { id: createMatchDto.tournamentId },
      });
      if (!tournament) {
        throw new NotFoundException(
          `Tournament with ID ${createMatchDto.tournamentId} not found`,
        );
      }
    }

    const match = this.matchesRepository.create({
      tournamentId: createMatchDto.tournamentId ?? null,
      opposingTeam: createMatchDto.opposingTeam,
      homeScore: createMatchDto.homeScore,
      awayScore: createMatchDto.awayScore,
      country: createMatchDto.country,
      city: createMatchDto.city,
      date: new Date(createMatchDto.date),
      description: createMatchDto.description ?? null,
    });

    return this.matchesRepository.save(match);
  }

  async update(id: number, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOne(id);

    // Verificar que el torneo exista si se proporciona
    if (updateMatchDto.tournamentId !== undefined) {
      if (updateMatchDto.tournamentId === null) {
        match.tournamentId = null;
      } else {
        const tournament = await this.tournamentsRepository.findOne({
          where: { id: updateMatchDto.tournamentId },
        });
        if (!tournament) {
          throw new NotFoundException(
            `Tournament with ID ${updateMatchDto.tournamentId} not found`,
          );
        }
        match.tournamentId = updateMatchDto.tournamentId;
      }
    }

    if (updateMatchDto.date !== undefined) {
      match.date = new Date(updateMatchDto.date);
    }

    Object.assign(match, updateMatchDto);
    return this.matchesRepository.save(match);
  }

  async remove(id: number): Promise<void> {
    const match = await this.findOne(id);
    await this.matchesRepository.remove(match);
  }
}
