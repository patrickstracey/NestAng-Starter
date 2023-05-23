import { Body, Controller, Get, Patch } from '@nestjs/common';
import { TokenInterface, UserInterface } from '../../../../shared/interfaces';
import { UserService } from './user.service';
import { UserEditDto } from './user.dto';
import { TokenData } from '../../utility/decorators';

@Controller('user')
export class UserController {
  constructor(private _user: UserService) {}

  @Get()
  getUserInfo(@TokenData() token: TokenInterface): Promise<UserInterface> {
    return this._user.getUser(token);
  }

  @Patch()
  updateUserInfo(
    @TokenData() token: TokenInterface,
    @Body() updates: UserEditDto,
  ): Promise<UserInterface> {
    return this._user.updateUser(token, updates);
  }
}
