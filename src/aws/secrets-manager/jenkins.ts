import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

interface Data {
    base: string;
    username: string;
    token: string;
    scope: string;
    credential: string;
}

interface Token {
    name: string;
    uuid: string;
    value: string;
}

interface Credential {
    folder: string;
    id: string;
}

export interface Info {
    base: string;
    username: string;
    token: Token;
    scope: string;
    credential: Credential;
}

const AJV = new Ajv();

const DATA_SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        base:       {type: 'string'},
        username:   {type: 'string'},
        token:      {type: 'string'},
        scope:      {type: 'string'},
        credential: {type: 'string'},
    },
    required: ['base', 'credential', 'scope', 'token', 'username'],
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

const CREDENTIAL_SCHEMA: JSONSchemaType<Credential> = {
    type:       'object',
    properties: {
        folder: {type: 'string'},
        id:     {type: 'string'},
    },
    required: ['folder', 'id'],
};

const INFO_SCHEMA: JSONSchemaType<Info> = {
    type:       'object',
    properties: {
        base:       {type: 'string'},
        username:   {type: 'string'},
        token:      TOKEN_SCHEMA,
        scope:      {type: 'string'},
        credential: CREDENTIAL_SCHEMA,
    },
    required: ['base', 'credential', 'scope', 'token', 'username'],
};

function parseToken(data: unknown, description?: string): Token {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins token.`);

    let token = data;
    if (typeof data === 'string') token = JSON.parse(data) as Token;

    if (!AJV.validate<Token>(TOKEN_SCHEMA, token)) throw new Error(`${description ?? ''} has no complete Jenkins token.`);

    return token;
}

function parseCredential(data: unknown, description?: string): Credential {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins credential.`);

    let credential = data;
    if (typeof data === 'string') credential = JSON.parse(data) as Credential;

    if (!AJV.validate<Credential>(CREDENTIAL_SCHEMA, credential)) throw new Error(`${description ?? ''} has no complete Jenkins credential.`);

    return credential;
}

export function parse(data: unknown, description?: string): Info {
    if (!data) throw new Error(`${description ?? ''} has no Jenkins info.`);

    let jenkins = data;
    if (typeof data === 'string') jenkins = JSON.parse(data) as Data;

    if (!AJV.validate<Data>(DATA_SCHEMA, jenkins)) throw new Error(`${description ?? ''} has no complete Jenkins info.`);

    return {
        base:       jenkins.base,
        username:   jenkins.username,
        token:      parseToken(jenkins.token, description),
        scope:      jenkins.scope,
        credential: parseCredential(jenkins.credential, description),
    };
}

export function stringify(info: Info): string {
    return JSON.stringify({
        ...info,
        token:      JSON.stringify(info.token),
        credential: JSON.stringify(info.credential),
    } as Data);
}
