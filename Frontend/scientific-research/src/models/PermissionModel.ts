export default class PermissionModel {
    permissionId: number;
    name: string;
    desc: string;
    slug: string;
    createdAt: string;
    updatedAt: string;

    constructor(permissionId: number,
        name: string,
        desc: string,
        slug: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.permissionId = permissionId;
        this.name = name;
        this.desc = name;
        this.slug = slug;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}