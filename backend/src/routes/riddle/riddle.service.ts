import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {TokenInterface } from '../../../../shared/interfaces';
import { PodcastDTO } from './riddle.dto';
import { UserService } from '../user';
import { DatabaseService } from '../../database';
import { DatabaseTables } from '../../../../shared/enums';
import { get } from 'http';
@Injectable()
export class RiddleService {
  constructor(
    private dbService: DatabaseService,
    private userService: UserService
  ) {}

  private usersCollection = DatabaseTables.PODCAST;

  get db() {
    return this.dbService.database.collection(this.usersCollection);
  }

stations = ["hof","statue", "bahn", "tower", "wohnmobil","schule", "kirche", "konzert"];

killer = "PeterSchulze";

  async setRiddleToSolved(token:TokenInterface, station:string):Promise<PodcastDTO>{
    if(!this.stations.includes(station)){
      throw new UnprocessableEntityException("We do not know this location. Maybe solve the riddle")
    }
    const member = (await this.userService.getMemberWithToken(token));
    if(!member){
      throw new UnprocessableEntityException("");
    }
    if(!member.stations.includes(station)){
      member.stations.push(station)
    }
    this.userService.updateMember(member)
    return this.getPodcast(station);
  }
  async makeGuess(token:TokenInterface, guess:string):Promise<PodcastDTO>{
    const member = await this.userService.getMemberWithToken(token);
    if(!member){
      throw new UnprocessableEntityException("");
    }
    if(member.finalGuess){
      throw new UnprocessableEntityException("You already made a guess");
    }
    member.finalGuess = guess;
    if(this.killer === guess){
      member.stations.push("winner")
      this.userService.updateMember(member)
      return this.getPodcast("winner");
    }else{
      member.stations.push("wellYouTried")
      this.userService.updateMember(member)
      return this.getPodcast("wellYouTried");
    }
  }

  async getPodcast(id:string):Promise<PodcastDTO>{
     return (await this.db.findOne({_id:id})) as PodcastDTO
  }
  async getPodcasts(token:TokenInterface):Promise<PodcastDTO[]>{
    const member = await this.userService.getMemberWithToken(token);
    if(!member){
      throw new UnprocessableEntityException("");
    }
    return (await this.db.find({ _id : { $in : member.stations } }).toArray())
  }
}
