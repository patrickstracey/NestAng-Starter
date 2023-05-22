import { TokenInterface } from '../../shared/interfaces';
import { PermissionEnum } from '../../shared/enums';

export const MOCK_ADMIN_TOKEN: TokenInterface = {
  uid: '62c1d8a85101d7e8e7bfbbfe',
  acc: PermissionEnum.ADMIN,
};

export const MOCK_RESIDENT_TOKEN: TokenInterface = {
  uid: '6342027c0f78226171c10835',
  acc: PermissionEnum.USER,
};
