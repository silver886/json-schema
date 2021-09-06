import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

interface Data {
    host: string;
    port?: number;
    ssl?: boolean;
    username: string;
    password: string;
    tags: string;
    permissions?: string;
    masterarn?: string;
}

export interface Permission {
    vhost: string;
    configure: string;
    write: string;
    read: string;
}

export interface Info {
    host: string;
    port?: number;
    ssl?: boolean;
    username: string;
    password: string;
    tags: string;
    permissions?: Permission[];
    masterarn?: string;
}

const AJV = new Ajv();

const DATA_SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        host: {type: 'string'},
        port: {
            type:     'integer',
            nullable: true,
        },
        ssl: {
            type:     'boolean',
            nullable: true,
        },
        username:    {type: 'string'},
        password:    {type: 'string'},
        tags:        {type: 'string'},
        permissions: {
            type:     'string',
            nullable: true,
        },
        masterarn: {
            type:     'string',
            nullable: true,
        },
    },
    required: [
        'host',
        'username',
        'password',
        'tags',
    ],
};

const PERMISSION_SCHEMA: JSONSchemaType<Permission> = {
    type:       'object',
    properties: {
        vhost:     {type: 'string'},
        configure: {type: 'string'},
        write:     {type: 'string'},
        read:      {type: 'string'},
    },
    required: [
        'vhost',
        'configure',
        'write',
        'read',
    ],
};

const PERMISSIONS_SCHEMA: JSONSchemaType<Permission[]> = {
    type:  'array',
    items: PERMISSION_SCHEMA,
};

const INFO_SCHEMA: JSONSchemaType<Info> = {
    type:       'object',
    properties: {
        host: {type: 'string'},
        port: {
            type:     'integer',
            nullable: true,
        },
        ssl: {
            type:     'boolean',
            nullable: true,
        },
        username:    {type: 'string'},
        password:    {type: 'string'},
        tags:        {type: 'string'},
        permissions: {
            ...PERMISSIONS_SCHEMA,
            nullable: true,
        },
        masterarn: {
            type:     'string',
            nullable: true,
        },
    },
    required: [
        'host',
        'username',
        'password',
        'tags',
    ],
};


function parsePermissions(data: unknown, description?: string): Permission[] {
    if (!data) throw new Error(`${description ?? ''} has no RabbitMQ permission.`);

    let permissions = data;
    if (typeof data === 'string') permissions = JSON.parse(data);

    if (!AJV.validate<Permission[]>(PERMISSIONS_SCHEMA, permissions)) throw new Error(`${description ?? ''} has no complete RabbitMQ permissions.`);

    return permissions;
}

export function parse(data: unknown, description?: string): Info {
    if (!data) throw new Error(`${description ?? ''} has no RabbitMQ info.`);

    let rabbitmq = data;
    if (typeof data === 'string') rabbitmq = JSON.parse(data);

    if (!AJV.validate<Data>(DATA_SCHEMA, rabbitmq)) throw new Error(`${description ?? ''} has no complete RabbitMQ info.`);

    return {
        host:     rabbitmq.host,
        username: rabbitmq.username,
        password: rabbitmq.password,
        tags:     rabbitmq.tags,
        ...rabbitmq.port ? {port: rabbitmq.port} : {},
        ...rabbitmq.ssl ? {ssl: rabbitmq.ssl} : {},
        ...rabbitmq.masterarn ? {masterarn: rabbitmq.masterarn} : {},
        ...rabbitmq.permissions ? {permissions: parsePermissions(rabbitmq.permissions, description)} : {},
    };
}

export function stringify(info: Info): string {
    const data: Data = {
        ...info,
        permissions: JSON.stringify(info.permissions),
    };
    return JSON.stringify(data);
}
