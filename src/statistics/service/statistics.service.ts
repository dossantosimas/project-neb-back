import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from '../entity/statistics.entity';
import { Player } from '../../players/entity/player.entity';
import { Match } from '../../matches/entity/match.entity';
import { CreateStatisticsDto } from '../dto/create-statistics.dto';
import { UpdateStatisticsDto } from '../dto/update-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async findAll(): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      relations: ['player', 'match'],
    });
  }

  async findOne(id: string): Promise<Statistics> {
    const statistics = await this.statisticsRepository.findOne({
      where: { id },
      relations: ['player', 'match'],
    });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async findByPlayer(playerId: number): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      where: { playerId },
      relations: ['player', 'match'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMatch(matchId: string): Promise<Statistics[]> {
    return this.statisticsRepository.find({
      where: { matchId },
      relations: ['player', 'match'],
    });
  }

  async create(createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    // Verificar que el jugador exista
    const player = await this.playersRepository.findOne({
      where: { id: createStatisticsDto.playerId },
    });
    if (!player) {
      throw new NotFoundException(
        `Player with ID ${createStatisticsDto.playerId} not found`,
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
        playerId: createStatisticsDto.playerId,
        matchId: createStatisticsDto.matchId,
      },
    });
    if (existingStats) {
      throw new BadRequestException(
        `Statistics for player ${createStatisticsDto.playerId} in match ${createStatisticsDto.matchId} already exist`,
      );
    }

    // Validar que los intentos sean mayores o iguales a los anotados
    if (
      createStatisticsDto.fgAttempted < createStatisticsDto.fgMade ||
      createStatisticsDto.threeAttempted < createStatisticsDto.threeMade ||
      createStatisticsDto.ftAttempted < createStatisticsDto.ftMade
    ) {
      throw new BadRequestException(
        'Attempted shots must be greater than or equal to made shots',
      );
    }

    const statistics = this.statisticsRepository.create(createStatisticsDto);
    return this.statisticsRepository.save(statistics);
  }

  async update(
    id: string,
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const statistics = await this.findOne(id);

    // Verificar que el jugador exista si se actualiza
    if (updateStatisticsDto.playerId !== undefined) {
      const player = await this.playersRepository.findOne({
        where: { id: updateStatisticsDto.playerId },
      });
      if (!player) {
        throw new NotFoundException(
          `Player with ID ${updateStatisticsDto.playerId} not found`,
        );
      }
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
    }

    // Validar que los intentos sean mayores o iguales a los anotados
    const fgAttempted =
      updateStatisticsDto.fgAttempted ?? statistics.fgAttempted;
    const fgMade = updateStatisticsDto.fgMade ?? statistics.fgMade;
    const threeAttempted =
      updateStatisticsDto.threeAttempted ?? statistics.threeAttempted;
    const threeMade = updateStatisticsDto.threeMade ?? statistics.threeMade;
    const ftAttempted =
      updateStatisticsDto.ftAttempted ?? statistics.ftAttempted;
    const ftMade = updateStatisticsDto.ftMade ?? statistics.ftMade;

    if (
      fgAttempted < fgMade ||
      threeAttempted < threeMade ||
      ftAttempted < ftMade
    ) {
      throw new BadRequestException(
        'Attempted shots must be greater than or equal to made shots',
      );
    }

    Object.assign(statistics, updateStatisticsDto);
    return this.statisticsRepository.save(statistics);
  }

  async remove(id: string): Promise<void> {
    const statistics = await this.findOne(id);
    await this.statisticsRepository.remove(statistics);
  }
}
