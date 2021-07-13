import * as src from '../../../src/';

describe('While parsing', () => {
    it('normal should pass', () => {
        expect(src.aws.secretsManager.jenkins.parse('{"base":"https://example.com","username":"test","token":"{\\"name\\":\\"unit test\\",\\"uuid\\":\\"ac84ec66-e8ad-48d4-a59f-c154c458a3ed\\",\\"value\\":\\"bd4b1c27-414f-43fc-a1fd-87b00bc6d11e\\"}","credentials":"{\\"root\\":{\\"scope\\":\\"hello/world\\",\\"folder\\":\\"/root\\",\\"id\\":\\"af113758-3813-4f40-bd1b-dcf4bf7b0d7a\\"},\\"user\\":{\\"scope\\":\\"hello/outside\\",\\"folder\\":\\"/user\\",\\"id\\":\\"f9785d38-86e3-4dfe-ba87-8d7d0bc235d6\\"}}"}')).
            toStrictEqual({
                base:     'https://example.com',
                username: 'test',
                token:    {
                    name:  'unit test',
                    uuid:  'ac84ec66-e8ad-48d4-a59f-c154c458a3ed',
                    value: 'bd4b1c27-414f-43fc-a1fd-87b00bc6d11e',
                },
                credentials: {
                    root: {
                        scope:  'hello/world',
                        folder: '/root',
                        id:     'af113758-3813-4f40-bd1b-dcf4bf7b0d7a',
                    },
                    user: {
                        scope:  'hello/outside',
                        folder: '/user',
                        id:     'f9785d38-86e3-4dfe-ba87-8d7d0bc235d6',
                    },
                },
            });
    });

    it('without credentials should pass', () => {
        expect(src.aws.secretsManager.jenkins.parse('{"base":"https://example.com","username":"test","token":"{\\"name\\":\\"unit test\\",\\"uuid\\":\\"ac84ec66-e8ad-48d4-a59f-c154c458a3ed\\",\\"value\\":\\"bd4b1c27-414f-43fc-a1fd-87b00bc6d11e\\"}"}')).
            toStrictEqual({
                base:     'https://example.com',
                username: 'test',
                token:    {
                    name:  'unit test',
                    uuid:  'ac84ec66-e8ad-48d4-a59f-c154c458a3ed',
                    value: 'bd4b1c27-414f-43fc-a1fd-87b00bc6d11e',
                },
            });
    });
});

describe('While stringifying', () => {
    it('normal should pass', () => {
        expect(src.aws.secretsManager.jenkins.stringify({
            base:     'https://example.com',
            username: 'test',
            token:    {
                name:  'unit test',
                uuid:  'ac84ec66-e8ad-48d4-a59f-c154c458a3ed',
                value: 'bd4b1c27-414f-43fc-a1fd-87b00bc6d11e',
            },
            credentials: {
                root: {
                    scope:  'hello/world',
                    folder: '/root',
                    id:     'af113758-3813-4f40-bd1b-dcf4bf7b0d7a',
                },
                user: {
                    scope:  'hello/outside',
                    folder: '/user',
                    id:     'f9785d38-86e3-4dfe-ba87-8d7d0bc235d6',
                },
            },
        })).toStrictEqual('{"base":"https://example.com","username":"test","token":"{\\"name\\":\\"unit test\\",\\"uuid\\":\\"ac84ec66-e8ad-48d4-a59f-c154c458a3ed\\",\\"value\\":\\"bd4b1c27-414f-43fc-a1fd-87b00bc6d11e\\"}","credentials":"{\\"root\\":{\\"scope\\":\\"hello/world\\",\\"folder\\":\\"/root\\",\\"id\\":\\"af113758-3813-4f40-bd1b-dcf4bf7b0d7a\\"},\\"user\\":{\\"scope\\":\\"hello/outside\\",\\"folder\\":\\"/user\\",\\"id\\":\\"f9785d38-86e3-4dfe-ba87-8d7d0bc235d6\\"}}"}');
    });

    it('without credentials should pass', () => {
        expect(src.aws.secretsManager.jenkins.stringify({
            base:     'https://example.com',
            username: 'test',
            token:    {
                name:  'unit test',
                uuid:  'ac84ec66-e8ad-48d4-a59f-c154c458a3ed',
                value: 'bd4b1c27-414f-43fc-a1fd-87b00bc6d11e',
            },
        })).toStrictEqual('{"base":"https://example.com","username":"test","token":"{\\"name\\":\\"unit test\\",\\"uuid\\":\\"ac84ec66-e8ad-48d4-a59f-c154c458a3ed\\",\\"value\\":\\"bd4b1c27-414f-43fc-a1fd-87b00bc6d11e\\"}"}');
    });
});
