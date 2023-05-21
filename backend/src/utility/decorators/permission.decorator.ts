import { SetMetadata } from "@nestjs/common";
import { PermissionEnum } from "../../../../shared/enums";

export const PERMISSION_KEY = "permission";
export const Permission = (role: PermissionEnum) => SetMetadata(PERMISSION_KEY, role);
