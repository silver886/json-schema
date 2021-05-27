import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

export interface Data {
    engine: string;
    dbClusterIdentifier?: string;
    dbname?: string;
    localDbName?: string;
    host: string;
    port?: number;
    ssl?: boolean;
    username: string;
    password: string;
    masterarn?: string;
}

const AJV = new Ajv();

const SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        engine:              {type: 'string'},
        dbClusterIdentifier: {
            type:     'string',
            nullable: true,
        },
        dbname: {
            type:     'string',
            nullable: true,
        },
        localDbName: {
            type:     'string',
            nullable: true,
        },
        host: {type: 'string'},
        port: {
            type:     'number',
            nullable: true,
        },
        ssl: {
            type:     'boolean',
            nullable: true,
        },
        username:  {type: 'string'},
        password:  {type: 'string'},
        masterarn: {
            type:     'string',
            nullable: true,
        },
    },
    required: [
        'engine',
        'host',
        'username',
        'password',
    ],
};

export function parse(data: unknown, description?: string): Data {
    if (!data) throw new Error(`${description ?? ''} has no DocumentDB info.`);

    let database = data;
    if (typeof data === 'string') database = JSON.parse(data) as Data;

    if (!AJV.validate<Data>(SCHEMA, database)) throw new Error(`${description ?? ''} has no complete DocumentDB info.`);

    return database;
}
