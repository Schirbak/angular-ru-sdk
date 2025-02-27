import {
    DataBeforeRequestOptions,
    DataClientRequestOptions,
    DataHttpInterceptor,
    DataHttpRequestOptions,
    DataUrlPathSegment,
    MetaDataRequest
} from '@angular-ru/http/typings';
import { getUrlSegments, urlParse } from '@angular-ru/http/utils';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';

import { DATA_HTTP_CLIENT_INTERCEPTOR } from '../tokens/data-http-client-interceptor.token';
import { RestTemplate } from '../utils/rest-template';
import { AbstractHttpClient } from './abstract-http.client';
import { DataConfiguratorService } from './data-configurator.service';

@Injectable()
export class DataHttpClient<K = unknown> extends AbstractHttpClient<K> {
    constructor() {
        super(
            inject<HttpClient>(HttpClient),
            inject<DataConfiguratorService>(DataConfiguratorService),
            inject<DataHttpInterceptor>(DATA_HTTP_CLIENT_INTERCEPTOR)
        );
    }

    protected request<T, R = T>(options: DataBeforeRequestOptions): Observable<R> {
        if (!this.local) {
            throw new Error(`You must use the @RestClient('controller') decorator for work correctly`);
        }

        this.interceptor.onBeforeRequest?.(options);
        const meta: MetaDataRequest = this.createMetaDataRequest(options);
        const observable: Observable<R> = this.http.request(options.method, meta.url, meta.requestOptions);
        return this.wrapHttpRequestWithMeta<T, R>(meta, options, observable);
    }

    protected restTemplate<T>(options?: Partial<DataClientRequestOptions>): Observable<T> {
        return new RestTemplate<T>(options).asProxyObservable();
    }

    private createMetaDataRequest(options: DataBeforeRequestOptions): MetaDataRequest {
        const { emitSuccess, emitFailure }: DataClientRequestOptions = options.clientOptions;
        const segments: DataUrlPathSegment = getUrlSegments(options.clientOptions);
        const requestOptions: DataHttpRequestOptions = this.createDataHttpRequestOptions(options);
        const url: string = urlParse(options.path, segments);
        return { method: options.method, url, emitSuccess, emitFailure, requestOptions };
    }

    private wrapHttpRequestWithMeta<T, R = T>(
        meta: MetaDataRequest,
        options: DataBeforeRequestOptions,
        observable: Observable<R>
    ): Observable<R> {
        return observable.pipe(
            tap(
                (response: R): void => this.onSuccess(response, meta, options),
                (error: HttpErrorResponse): void => this.onError(error, meta, options)
            ),
            catchError((error: HttpErrorResponse): Observable<never> => this.onCatch(error, meta)),
            finalize((): void => this.interceptor.onFinalizeAfterRequest?.(meta)),
            take(1)
        );
    }

    private onSuccess<R>(response: R, meta: MetaDataRequest, options: DataBeforeRequestOptions): void {
        if (options.clientOptions.emitSuccess) {
            this.interceptor.success$?.next({ options, meta });
            this.interceptor.onEmitSuccess?.(response, options, meta);
        }

        this.interceptor.onTapAfterRequest?.(response, meta);
    }

    private onError(error: HttpErrorResponse, meta: MetaDataRequest, options: DataBeforeRequestOptions): void {
        if (options.clientOptions.emitFailure) {
            this.interceptor.errors$?.next({ error, options, meta });
            this.interceptor.onEmitFailure?.(error, options, meta);
        }

        this.interceptor.onErrorAfterRequest?.(error, meta);
    }

    private onCatch(error: HttpErrorResponse, meta: MetaDataRequest): Observable<never> {
        return this.interceptor.onCatchErrorAfterRequest?.(error, meta) ?? throwError(error);
    }
}
