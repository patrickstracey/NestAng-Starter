import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  MongoService,
  TestCloseLocalDb,
  TestConnectLocalDb,
} from '../database/mongo';
import { MOCK_ADMIN_TOKEN, MOCK_RESIDENT_TOKEN } from '../../test/token_helper';
import { UserInterface } from '../../../shared/interfaces';
import { TypesEnum } from '../../../shared/enums';
import { ForbiddenException } from '@nestjs/common';
import { UserEditDto } from './user.dto';

const SEED_DATA: UserInterface[] = require('../../../mongo_seeds/seed_data/users.json');

describe('UserService', () => {
  let service: UserService;
  let db: MongoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, MongoService],
    }).compile();
    db = module.get<MongoService>(MongoService);
    db.assignDatabase(await TestConnectLocalDb());
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await TestCloseLocalDb();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the current admin (clean) user user', async () => {
    const res: UserInterface = await service.getUser(MOCK_ADMIN_TOKEN);
    expect(res._id.toString()).toEqual(MOCK_ADMIN_TOKEN.uid);
    expect(res.type).toEqual(TypesEnum.USER);
    expect(res.password).not.toBeDefined();
    expect(res.email).toBeDefined();
  });

  it('should patch the current admin users name', async () => {
    const update = { ...getUserDto(SEED_DATA[0]), name: 'Joey Adminman' };
    const res = await service.updateUser(MOCK_ADMIN_TOKEN, update);
    expect(res.name).toEqual(update.name);
    expect(res.email).toEqual(SEED_DATA[0].email);
    expect(res._id.toString()).toEqual(MOCK_ADMIN_TOKEN.uid);
  });

  it('should patch the current admin users phone ', async () => {
    const phoneUpdate = { ...getUserDto(SEED_DATA[0]), phone: '2125550119' };
    const res = await service.updateUser(MOCK_ADMIN_TOKEN, phoneUpdate);
    expect(res.phone).toEqual(phoneUpdate.phone);
    expect(res.email).toEqual(SEED_DATA[0].email);
    expect(res._id.toString()).toEqual(MOCK_ADMIN_TOKEN.uid);
  });

  it('should get the current resident (clean) user user', async () => {
    const res: UserInterface = await service.getUser(MOCK_RESIDENT_TOKEN);
    expect(res._id.toString()).toEqual(MOCK_RESIDENT_TOKEN.uid);
    expect(res.type).toEqual(TypesEnum.USER);
    expect(res.password).not.toBeDefined();
    expect(res.email).toBeDefined();
  });

  it('should patch the current resident users name', async () => {
    const update = { ...getUserDto(SEED_DATA[1]), name: 'Unit Test Name' };
    const res = await service.updateUser(MOCK_RESIDENT_TOKEN, update);
    expect(res.name).toEqual(update.name);
    expect(res.email).toEqual(SEED_DATA[1].email);
    expect(res._id.toString()).toEqual(MOCK_RESIDENT_TOKEN.uid);
  });

  it('should patch the current resident users phone ', async () => {
    const phoneUpdate = { ...getUserDto(SEED_DATA[1]), phone: '8825550119' };
    const res = await service.updateUser(MOCK_RESIDENT_TOKEN, phoneUpdate);
    expect(res.phone).toEqual(phoneUpdate.phone);
    expect(res.email).toEqual(SEED_DATA[1].email);
    expect(res._id.toString()).toEqual(MOCK_RESIDENT_TOKEN.uid);
  });

  it("should prevent user from updating someone else's user", async () => {
    const phoneUpdate = { ...getUserDto(SEED_DATA[0]), phone: '8825550119' };
    await expect(
      service.updateUser(MOCK_RESIDENT_TOKEN, phoneUpdate),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("should prevent admin from updating someone else's user", async () => {
    const phoneUpdate = { ...getUserDto(SEED_DATA[1]), phone: '8825550119' };
    await expect(
      service.updateUser(MOCK_ADMIN_TOKEN, phoneUpdate),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});

function getUserDto(user: UserInterface): UserEditDto {
  return {
    _id: user._id['$oid'].toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}
