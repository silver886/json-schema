import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

interface Data {
    base: string;
    username: string;
    token: string;
    scope: string;
    credentials: string;
}

export interface Token {
    name: string;
    uuid: string;
    value: string;
}

export interface Credential {
    folder: string;
    id: string;
}

export interface Info {
    base: string;
    username: string;
    token: Token;
    scope: string;
    credentials: Record<string, Credential>;
}

const AJV = new Ajv();

const DATA_SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        base:        {type: 'string'},
        username:    {type: 'string'},
        token:       {type: 'string'},
        scope:       {type: 'string'},
        credentials: {type: 'string'},
    },
    required: ['base', 'credentials', 'scope', 'token', 'username'],
};

const TOKEN_SCHEMA: JSONSchemaType<Token> = {
    type:       'object',
    properties: {
        name:  {type: 'string'},
        uuid:  {type: 'string'},
        value: {type: 'string'},
    },
    required: ['uuid', 'value'],
};

const CREDENTIALS_SCHEMA: JSONSchemaType<Record<string, Credential>> = {
    type:                 'object',
    propertyNames:        {type: 'string'},
    additionalProperties: {
        type:       'object',
        properties: {
            folder: {type: 'string'},
            id:     {type: 'string'},
        },
        required: ['folder', 'id'],
    },
    required: [],
};

const INFO_SCHEMA: JSONSchemaType<Info> = {
    type:       'object',
    properties: {
        base:        {type: 'string'},
        username:    {type: 'string'},
        token:       TOKEN_SCHEMA,
        scope:       {type: 'string'},
        credentials: CREDENTIALS_SCHEMA,
    },
    required: ['base', 'credentials', 'scope', 'token', 'username'],
};

function parseToken(data: unknown, description?: string): Token {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins token.`);

    let token = data;
    if (typeof data === 'string') token = JSON.parse(data);

    if (!AJV.validate<Token>(TOKEN_SCHEMA, token)) throw new Error(`${description ?? ''} has no complete Jenkins token.`);

    return token;
}

function parseCredentials(data: unknown, description?: string): Record<string, Credential> {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins credentials.`);

    let credentials = data;
    if (typeof data === 'string') credentials = JSON.parse(data);

    if (!AJV.validate<Record<string, Credential>>(CREDENTIALS_SCHEMA, credentials)) throw new Error(`${description ?? ''} has no complete Jenkins credentials.`);

    return credentials;
}

export function parse(data: unknown, description?: string): Info {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins info.`);

    let jenkins = data;
    if (typeof data === 'string') jenkins = JSON.parse(data);

    if (!AJV.validate<Data>(DATA_SCHEMA, jenkins)) throw new Error(`${description ?? ''} has no complete Jenkins info.`);

    return {
        base:        jenkins.base,
        username:    jenkins.username,
        token:       parseToken(jenkins.token, description),
        scope:       jenkins.scope,
        credentials: parseCredentials(jenkins.credentials, description),
    };
}

export function stringify(info: Info): string {
    const data: Data = {
        ...info,
        token:       JSON.stringify(info.token),
        credentials: JSON.stringify(info.credentials),
    };
    return JSON.stringify(data);
}
