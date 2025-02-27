import { Any } from '@angular-ru/common/typings';
import { DataClientRequestOptions } from '@angular-ru/http/typings';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { DATA_REQUEST_OPTIONS_CONFIG } from './configs/data-request-options.config';
import { DataConfiguratorService } from './services/data-configurator.service';
import { DataHttpClient } from './services/data-http.client';
import { DefaultHttpClientInterceptor } from './services/default-http-client-interceptor';
import { DATA_CONFIG_SERVICE_TOKEN } from './tokens/data-config-service.token';
import { DATA_HTTP_CLIENT_INTERCEPTOR } from './tokens/data-http-client-interceptor.token';

@NgModule()
export class DataHttpClientModule {
    public static forRoot<K = Any>(
        clients: Type<unknown>[] = [],
        options: Partial<DataClientRequestOptions<K>> = {}
    ): ModuleWithProviders<DataHttpClientModule> {
        return {
            ngModule: DataHttpClientModule,
            providers: [
                DataConfiguratorService,
                { provide: DATA_CONFIG_SERVICE_TOKEN, useValue: { ...DATA_REQUEST_OPTIONS_CONFIG, ...options } },
                { provide: DATA_HTTP_CLIENT_INTERCEPTOR, useClass: DefaultHttpClientInterceptor },
                DataHttpClient,
                ...clients
            ]
        };
    }

    public static forFeature(clients: Type<unknown>[] = []): ModuleWithProviders<DataHttpClientModule> {
        return { ngModule: DataHttpClientModule, providers: clients };
    }
}
