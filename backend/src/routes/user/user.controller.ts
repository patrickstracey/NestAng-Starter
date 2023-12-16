import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { TokenInterface, LodgeUserInterface } from '../../../../shared/interfaces';
import { UserService } from './user.service';
import { TokenData } from '../../utility/decorators';

@Controller('user')
export class UserController {
  constructor(private _user: UserService) {}

  @Get()
  getUserInfo(@TokenData() token: TokenInterface): Promise<LodgeUserInterface> {
    return this._user.getMemberWithToken(token);
  }

  @Get('members')
  getAllUsers(): Promise<LodgeUserInterface[]>{
    return this._user.getAllMembers()
  }
}
