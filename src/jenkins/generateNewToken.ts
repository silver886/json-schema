import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

interface Data {
    status: string;
    data: {
        tokenName: string;
        tokenUuid: string;
        tokenValue: string;
    };
}

const AJV = new Ajv();

const SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        status: {type: 'string'},
        data:   {
            type:       'object',
            properties: {
                tokenName:  {type: 'string'},
                tokenUuid:  {type: 'string'},
                tokenValue: {type: 'string'},
            },
            required: ['tokenName', 'tokenUuid', 'tokenValue'],
        },
    },
    required: ['status', 'data'],
};

export function parse(data: unknown, description?: string): Data {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins token.`);

    let token = data;
    if (typeof data === 'string') token = JSON.parse(data);

    if (!AJV.validate<Data>(SCHEMA, token)) throw new Error(`${description ?? ''} has no complete Jenkins token.`);

    return token;
}
