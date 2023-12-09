import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { RiddleService } from './riddle.service';
import {
  TokenInterface,
} from '../../../../shared/interfaces';
import {
  ForbiddenException,
} from '@nestjs/common';
import { PodcastDTO } from './riddle.dto';
import { TokenData } from '../../utility/decorators';

@Controller('riddle')
export class RiddleController {
  constructor(private readonly riddleService: RiddleService) {}

  @Get("/:station")
  solvedRiddle(@TokenData() token:TokenInterface, @Param('station') station:string):Promise<PodcastDTO>{
      return this.riddleService.setRiddleToSolved(token, station);
  }

  @Get("guess/:name")
  makeGuess(@TokenData() token:TokenInterface, @Param('name') name:string):Promise<PodcastDTO>{
      return this.riddleService.makeGuess(token, name);
  }

  @Get("/search/podcasts")
  getPodcasts(@TokenData() token:TokenInterface):Promise<PodcastDTO[]>{
      return this.riddleService.getPodcasts(token);
  }
}
