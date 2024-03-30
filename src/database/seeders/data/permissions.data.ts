import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';

export type Group = 'User' | 'Role' | 'Permission' | 'Other';

export interface PermissionDatum {
  id: number;
  name: string;
  slugedName: SlugedNamePermission;
  group: Group;
}

export const PERMISSIONS_DATA: PermissionDatum[] = [
  {
    id: 1,
    name: 'Create User',
    slugedName: SlugedNamePermission.CREATE_USER,
    group: 'User',
  },
  {
    id: 2,
    name: 'Read Users',
    slugedName: SlugedNamePermission.READ_USERS,
    group: 'User',
  },
  {
    id: 3,
    name: 'Read User',
    slugedName: SlugedNamePermission.READ_USER,
    group: 'User',
  },
  {
    id: 4,
    name: 'Update User',
    slugedName: SlugedNamePermission.UPDATE_USER,
    group: 'User',
  },
  {
    id: 5,
    name: 'Delete User',
    slugedName: SlugedNamePermission.DELETE_USER,
    group: 'User',
  },
  {
    id: 6,
    name: 'Inactivate User',
    slugedName: SlugedNamePermission.INACTIVATE_USER,
    group: 'User',
  },
  {
    id: 7,
    name: 'Activate User',
    slugedName: SlugedNamePermission.ACTIVATE_USER,
    group: 'User',
  },
  {
    id: 8,
    name: 'Find By Email User',
    slugedName: SlugedNamePermission.FIND_BY_EMAIL_USER,
    group: 'User',
  },
  {
    id: 9,
    name: 'Assign Roles To User',
    slugedName: SlugedNamePermission.ASSIGN_ROLES_TO_USER,
    group: 'User',
  },
  {
    id: 10,
    name: 'Assign Permissions To User',
    slugedName: SlugedNamePermission.ASSIGN_PERMISSIONS_TO_USER,
    group: 'User',
  },
  {
    id: 11,
    name: 'Find All Permissions Of User',
    slugedName: SlugedNamePermission.FIND_ALL_PERMISSIONS_OF_USER,
    group: 'User',
  },
  {
    id: 12,
    name: 'Get Data About Me',
    slugedName: SlugedNamePermission.GET_DATA_ABOUT_ME,
    group: 'User',
  },
  {
    id: 13,
    name: 'Create Role',
    slugedName: SlugedNamePermission.CREATE_ROLE,
    group: 'Role',
  },
  {
    id: 14,
    name: 'Read Roles',
    slugedName: SlugedNamePermission.READ_ROLES,
    group: 'Role',
  },
  {
    id: 15,
    name: 'Read Role',
    slugedName: SlugedNamePermission.READ_ROLE,
    group: 'Role',
  },
  {
    id: 16,
    name: 'Update Role',
    slugedName: SlugedNamePermission.UPDATE_ROLE,
    group: 'Role',
  },
  {
    id: 17,
    name: 'Delete Role',
    slugedName: SlugedNamePermission.DELETE_ROLE,
    group: 'Role',
  },
  {
    id: 18,
    name: 'Assign Permissions To Role',
    slugedName: SlugedNamePermission.ASSIGN_PERMISSIONS_TO_ROLE,
    group: 'Role',
  },
  {
    id: 19,
    name: 'Read Permissions',
    slugedName: SlugedNamePermission.READ_PERMISSIONS,
    group: 'Permission',
  },
  {
    id: 20,
    name: 'Read Permission',
    slugedName: SlugedNamePermission.READ_PERMISSION,
    group: 'Permission',
  },
];
