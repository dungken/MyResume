export default class RoleModel {
    roleId: number;
    roleName: string;
    desc: string;
    createdAt: string;
    updatedAt: string;
    permissions: Array<number>;

    constructor(roleId: number,
        roleName: string,
        desc: string,
        createdAt: string,
        updatedAt: string,
        permissions: Array<number>
    ) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.desc = desc;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.permissions = permissions;
    }
}