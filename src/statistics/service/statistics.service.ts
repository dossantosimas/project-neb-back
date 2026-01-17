import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from '../entity/statistics.entity';
import { PlayerProfile } from '../../profiles/entity/player-profile.entity';
import { Match } from '../../matches/entity/match.entity';
import { CreateStatisticsDto } from '../dto/create-statistics.dto';
import { UpdateStatisticsDto } from '../dto/update-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(PlayerProfile)
    private playerProfilesRepository: Repository<PlayerProfile>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      relations: ['player', 'match'],
    });
  }

  async findOne(id: number): Promise<Statistics> {
    const statistics = await this.statisticsRepository.findOne({
      where: { id },
      relations: ['player', 'match'],
    });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async findByPlayer(playerProfileId: number): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      where: { playerProfileId },
      relations: ['player', 'match'],
      order: { id: 'DESC' },
    });
  }

  async findByMatch(matchId: number): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      where: { matchId },
      relations: ['player', 'match'],
    });
  }

  async create(createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    // Verificar que el jugador exista
    const playerProfile = await this.playerProfilesRepository.findOne({
      where: { id: createStatisticsDto.playerProfileId },
    });
    if (!playerProfile) {
      throw new NotFoundException(
        `PlayerProfile with ID ${createStatisticsDto.playerProfileId} not found`,
      );
    }

    // Verificar que el partido exista
    const match = await this.matchesRepository.findOne({
      where: { id: createStatisticsDto.matchId },
    });
    if (!match) {
      throw new NotFoundException(
        `Match with ID ${createStatisticsDto.matchId} not found`,
      );
    }

    // Verificar que no existan estadísticas duplicadas para el mismo jugador y partido
    const existingStats = await this.statisticsRepository.findOne({
      where: {
        playerProfileId: createStatisticsDto.playerProfileId,
        matchId: createStatisticsDto.matchId,
      },
    });
    if (existingStats) {
      throw new BadRequestException(
        `Statistics for player ${createStatisticsDto.playerProfileId} in match ${createStatisticsDto.matchId} already exist`,
      );
    }

    const statistics = this.statisticsRepository.create({
      playerProfileId: createStatisticsDto.playerProfileId,
      matchId: createStatisticsDto.matchId,
      points: createStatisticsDto.points,
      rebounds: createStatisticsDto.rebounds,
      assists: createStatisticsDto.assists,
      steals: createStatisticsDto.steals,
      blocks: createStatisticsDto.blocks,
    });
    return this.statisticsRepository.save(statistics);
  }

  async update(
    id: number,
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const statistics = await this.findOne(id);

    // Verificar que el jugador exista si se actualiza
    if (updateStatisticsDto.playerProfileId !== undefined) {
      const playerProfile = await this.playerProfilesRepository.findOne({
        where: { id: updateStatisticsDto.playerProfileId },
      });
      if (!playerProfile) {
        throw new NotFoundException(
          `PlayerProfile with ID ${updateStatisticsDto.playerProfileId} not found`,
        );
      }
      statistics.playerProfileId = updateStatisticsDto.playerProfileId;
    }

    // Verificar que el partido exista si se actualiza
    if (updateStatisticsDto.matchId !== undefined) {
      const match = await this.matchesRepository.findOne({
        where: { id: updateStatisticsDto.matchId },
      });
      if (!match) {
        throw new NotFoundException(
          `Match with ID ${updateStatisticsDto.matchId} not found`,
        );
      }
      statistics.matchId = updateStatisticsDto.matchId;
    }

    // Actualizar campos básicos
    if (updateStatisticsDto.points !== undefined) {
      statistics.points = updateStatisticsDto.points;
    }
    if (updateStatisticsDto.rebounds !== undefined) {
      statistics.rebounds = updateStatisticsDto.rebounds;
    }
    if (updateStatisticsDto.assists !== undefined) {
      statistics.assists = updateStatisticsDto.assists;
    }
    if (updateStatisticsDto.steals !== undefined) {
      statistics.steals = updateStatisticsDto.steals;
    }
    if (updateStatisticsDto.blocks !== undefined) {
      statistics.blocks = updateStatisticsDto.blocks;
    }

    return this.statisticsRepository.save(statistics);
  }

  async remove(id: number): Promise<void> {
    const statistics = await this.findOne(id);
    await this.statisticsRepository.remove(statistics);
  }
}
