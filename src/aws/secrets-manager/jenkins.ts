import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

// TODO (Leo Liu): Flatten data.
interface Data {
    base: string;
    username: string;
    token: {
        name: string;
        uuid: string;
        value: string;
    };
    scope: string;
    credential: {
        folder: string;
        id: string;
    };
}

const AJV = new Ajv();

const SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        base:     {type: 'string'},
        username: {type: 'string'},
        token:    {
            type:       'object',
            properties: {
                name:  {type: 'string'},
                uuid:  {type: 'string'},
                value: {type: 'string'},
            },
            required: ['uuid', 'value'],
        },
        scope:      {type: 'string'},
        credential: {
            type:       'object',
            properties: {
                folder: {type: 'string'},
                id:     {type: 'string'},
            },
            required: ['folder', 'id'],
        },
    },
    required: ['base', 'credential', 'scope', 'token', 'username'],
};

export function parse(data: unknown, description?: string): Data {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins info.`);

    let jenkins = data;
    if (typeof data === 'string') jenkins = JSON.parse(data) as Data;

    if (!AJV.validate<Data>(SCHEMA, jenkins)) throw new Error(`${description ?? ''} has no complete Jenkins info.`);

    return jenkins;
}
