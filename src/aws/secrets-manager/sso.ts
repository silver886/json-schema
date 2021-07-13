import Ajv from 'ajv';
import type {JSONSchemaType} from 'ajv';

interface Data {
    config: string;
    id: string;
    secret: string;
    consumer?: string;
}

export interface Config {
    userPoolId: string;
    userPoolUrl: string;
    clientName: string;
}

export interface Consumer {
    cluster: string;
    service: string;
}

export interface Info {
    config: Config;
    id: string;
    secret: string;
    consumer?: Consumer;
}

const AJV = new Ajv();

const DATA_SCHEMA: JSONSchemaType<Data> = {
    type:       'object',
    properties: {
        config:   {type: 'string'},
        id:       {type: 'string'},
        secret:   {type: 'string'},
        consumer: {
            type:     'string',
            nullable: true,
        },
    },
    required: ['config', 'id', 'secret'],
};

const CONFIG_SCHEMA: JSONSchemaType<Config> = {
    type:       'object',
    properties: {
        userPoolId:  {type: 'string'},
        userPoolUrl: {type: 'string'},
        clientName:  {type: 'string'},
    },
    required: ['userPoolId', 'userPoolUrl', 'clientName'],
};

const CONSUMER_SCHEMA: JSONSchemaType<Consumer> = {
    type:       'object',
    properties: {
        cluster: {type: 'string'},
        service: {type: 'string'},
    },
    required: [],
};

const INFO_SCHEMA: JSONSchemaType<Info> = {
    type:       'object',
    properties: {
        config:   CONFIG_SCHEMA,
        id:       {type: 'string'},
        secret:   {type: 'string'},
        consumer: {
            ...CONSUMER_SCHEMA,
            nullable: true,
        },
    },
    required: ['config', 'id', 'secret'],
};

function parseConfig(data: unknown, description?: string): Config {
    if (!data) throw new Error(`${description ?? ''} has no SSO config.`);

    let config = data;
    if (typeof data === 'string') config = JSON.parse(data);

    if (!AJV.validate<Config>(CONFIG_SCHEMA, config)) throw new Error(`${description ?? ''} has no complete SSO config.`);

    return config;
}

function parseConsumer(data: unknown, description?: string): Consumer {
    if (!data) throw new Error(`${description ?? ''} has no SSO consumer.`);

    let consumer = data;
    if (typeof data === 'string') consumer = JSON.parse(data);

    if (!AJV.validate<Consumer>(CONSUMER_SCHEMA, consumer)) throw new Error(`${description ?? ''} has no complete SSO consumer.`);

    return consumer;
}

export function parse(data: unknown, description?: string): Info {
    if (!data) throw new Error(`${description ?? ''} has no SSO info.`);

    let sso = data;
    if (typeof data === 'string') sso = JSON.parse(data);

    if (!AJV.validate<Data>(DATA_SCHEMA, sso)) throw new Error(`${description ?? ''} has no complete SSO info.`);

    return {
        config: parseConfig(sso.config, description),
        id:     sso.id,
        secret: sso.secret,
        ...sso.consumer ?
            {consumer: parseConsumer(sso.consumer, description)} :
            {},
    };
}

export function stringify(info: Info): string {
    const data: Data = {
        ...info,
        config:   JSON.stringify(info.config),
        consumer: JSON.stringify(info.consumer),
    };
    return JSON.stringify(data);
}
