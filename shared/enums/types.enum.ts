//Old types. We keep them until refactor is done
export enum TypesEnum {
  USER = 1,
  ACL = 2,
  INVITE = 12,
  PASSWORD_RESET = 13,
  ORGANIZATION = 20,
}

export enum UserTypesEnum{
  ZELLMEMBER = 1, //members that can go to a location
  EXTERNALMEMBER = 413, //memebers that can not go to a location
  GRANDMASTER = 1032, //admins
  //we use rnd numbers to stop people from guessing and changing their own type. To many devs in ths group
}
