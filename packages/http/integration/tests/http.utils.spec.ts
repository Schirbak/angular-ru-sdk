import {
    ensurePathByPathVariables,
    getHttpHeader,
    getHttpParams,
    getPathWithoutQueryParams,
    getUrlSegments,
    isAbsolutePath,
    isLocalhost,
    parseQueryParams,
    replaceDoubleSlash,
    urlParse
} from '@angular-ru/http/utils';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { PlainObject } from '@angular-ru/common/typings';

describe('[TEST]: http utils', () => {
    it('isLocalhost', () => {
        expect(isLocalhost('https://localhost:4200')).toEqual(true);
        expect(isLocalhost('https://0.0.0.0:4200')).toEqual(true);
        expect(isLocalhost('https://127.0.0.1:4200')).toEqual(true);
        expect(isLocalhost('https://google.com')).toEqual(false);
        expect(isLocalhost('https://google.com/localhost')).toEqual(false);
    });

    it('getPathWithoutQueryParams', () => {
        expect(getPathWithoutQueryParams('http://hello/world/todo/1/all')).toEqual('http://hello/world/todo/1/all');
        expect(getPathWithoutQueryParams('http://hello/world/todo/1/all/')).toEqual('http://hello/world/todo/1/all/');
        expect(getPathWithoutQueryParams('http://hello/world/todo/1/all?')).toEqual('http://hello/world/todo/1/all');
        expect(getPathWithoutQueryParams('http://hello/world/todo/1/all/?')).toEqual('http://hello/world/todo/1/all/');
        expect(getPathWithoutQueryParams('http://hello/world/todo/1/all?pageSize=10&pageIndex=0')).toEqual(
            'http://hello/world/todo/1/all'
        );
    });

    it('getUrlSegments', () => {
        expect(getUrlSegments({})).toEqual({ hostUrl: 'http://localhost/', baseUrl: '' });
        expect(getUrlSegments({ hostUrl: 'http://hello_world', baseUrl: 'api' })).toEqual({
            hostUrl: 'http://hello_world/',
            baseUrl: '/api/'
        });
        expect(getUrlSegments({ hostUrl: 'http://hello_world/', baseUrl: '/api/' })).toEqual({
            hostUrl: 'http://hello_world/',
            baseUrl: '/api/'
        });
    });

    it('isAbsolutePath', () => {
        expect(isAbsolutePath('/api')).toEqual(false);
        expect(isAbsolutePath('//hello_world')).toEqual(false);
        expect(isAbsolutePath('http://hello_world')).toEqual(true);
    });

    it('replaceDoubleSlash', () => {
        expect(replaceDoubleSlash('https://a///b//c/d/')).toEqual('https://a/b/c/d/');
        expect(replaceDoubleSlash('////a///b//c/d/')).toEqual('/a/b/c/d/');
    });

    it('urlParse', () => {
        expect(urlParse('////a///b//c/d/', getUrlSegments())).toEqual('http://localhost/a/b/c/d/');
        expect(urlParse('////a///b//c/d/', getUrlSegments({ baseUrl: 'api-backend' }))).toEqual(
            'http://localhost/api-backend/a/b/c/d/'
        );

        expect(urlParse('////a///b//c/d?quick', getUrlSegments({ hostUrl: 'https://127.0.0.0:8030' }))).toEqual(
            'https://127.0.0.0:8030/a/b/c/d'
        );
    });

    it('getHttpHeader', () => {
        const headers: HttpHeaders = getHttpHeader({ a: '1', b: '2' });
        expect(headers.keys()).toEqual(['a', 'b']);
        expect(headers.get('a')).toEqual('1');
        expect(headers.get('b')).toEqual('2');
    });

    it('parseQueryParams', () => {
        const queryParams: PlainObject = parseQueryParams('/todos/get?pageSize=5&value=2');
        expect(queryParams).toEqual({ pageSize: '5', value: '2' });
    });

    it('getHttpHeader', () => {
        const params: HttpParams = getHttpParams('/todos/get?pageSize=5&value=2', { pageIndex: 0 });
        expect(params.keys()).toEqual(['pageSize', 'value', 'pageIndex']);
        expect(params.get('pageSize')).toEqual('5');
        expect(params.get('value')).toEqual('2');
        expect(params.get('pageIndex')).toEqual(0);
    });

    it('ensurePathByPathVariables', () => {
        const map = new Map();
        map.set('id', 5);
        map.set('newId', 6);

        expect(ensurePathByPathVariables(`/a/{newId}/b/{id}/d`, map)).toEqual('/a/6/b/5/d');
        expect(ensurePathByPathVariables(`/a/{invalidName}`, map)).toEqual('/a/{invalidName}');
    });
});
