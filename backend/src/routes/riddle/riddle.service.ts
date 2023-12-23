import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {LodgeUserInterface, TokenInterface } from '../../../../shared/interfaces';
import { PodcastDTO } from './riddle.dto';
import { UserService } from '../user';
import { DatabaseService } from '../../database';
import { DatabaseTables } from '../../../../shared/enums';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';

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

killer = "Peter Schulze";

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
    const podcasts = (await this.db.find({ _id : { $ne : "test" } }).toArray());
    podcasts.forEach(element => {
      if(member.stations.includes(element._id)){
        element.enabled = true;
      }else{
        element.enabled = false;
        element.name = "Noch nicht verfügbar";
        element.audioUrl = "";
      }
    });

    return podcasts.sort((a,b) => {return a.number - b.number;});
  }

  async getPriceCert(token:TokenInterface){
    const member = (await this.userService.getMemberWithToken(token)) as LodgeUserInterface;
    if(!member){
      throw new ForbiddenException("No you can not do this!");
    }
    const options = {
      displayHeaderFooter: false,
      landscape: false,
    };
    if(member.stations.includes("wellYouTried")){
      const filePath = path.join(process.cwd(), 'templates', 'pdf-failedCert.hbs');
      return createPdf(filePath, options, member)
    }
    if(member.stations.includes("winner")){
      const filePath = path.join(process.cwd(), 'templates', 'pdf-winnerCert.hbs');
      return createPdf(filePath, options, member)
    }
    const filePath = path.join(process.cwd(), 'templates', 'pdf-wtf.hbs');
    return createPdf(filePath, options, member)
  }
}