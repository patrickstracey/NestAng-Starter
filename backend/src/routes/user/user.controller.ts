import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { TokenInterface, LodgeUserInterface } from '../../../../shared/interfaces';
import { UserService } from './user.service';
import { UserEditDto } from './user.dto';
import { TokenData } from '../../utility/decorators';

@Controller('user')
export class UserController {
  constructor(private _user: UserService) {}

  @Get(":'name'")
  getUserInfo(@Param('name') user:string): Promise<LodgeUserInterface> {
    return this._user.getMember(user, false);
  }

  @Patch()
  updateUserInfo(
    @TokenData() token: TokenInterface,
    @Body() updates: UserEditDto,
  ): Promise<LodgeUserInterface> {
    return this._user.updateMember(token, updates);
  }

  @Get('members')
  getAllUsers(): Promise<LodgeUserInterface[]>{
    return this._user.getAllMembers()
  }
}
