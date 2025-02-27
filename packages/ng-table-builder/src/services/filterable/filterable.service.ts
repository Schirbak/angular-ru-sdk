import { checkIsShallowEmpty } from '@angular-ru/common/object';
import { Any, PlainObject, PlainObjectOf, Resolver } from '@angular-ru/common/typings';
import { WebWorkerThreadService } from '@angular-ru/common/webworker';
import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { TABLE_GLOBAL_OPTIONS } from '../../config/table-global-options';
import { TableRow } from '../../interfaces/table-builder.external';
import { filterAllWorker } from './filter.worker';
import {
    FilterableInterface,
    FilterableMessage,
    FilterEvent,
    FilterStateEvent,
    FilterWorkerEvent,
    TableFilterType
} from './filterable.interface';

const { TIME_IDLE }: typeof TABLE_GLOBAL_OPTIONS = TABLE_GLOBAL_OPTIONS;

@Injectable()
export class FilterableService implements FilterableInterface {
    public filterValue: string | null = null;
    public definition: PlainObject = {};
    public state: FilterStateEvent = new FilterStateEvent();
    public types: PlainObject = TableFilterType;
    public readonly filterOpenEvents: Subject<void> = new Subject();
    public readonly events: Subject<FilterEvent> = new ReplaySubject();
    public readonly resetEvents: Subject<void> = new Subject<void>();
    public filterType: string | TableFilterType | null = null;
    public filterTypeDefinition: PlainObjectOf<TableFilterType> = {};
    public filtering: boolean = false;
    private previousFiltering: boolean = false;
    private readonly thread: WebWorkerThreadService;
    private readonly app: ApplicationRef;

    constructor(injector: Injector) {
        this.app = injector.get<ApplicationRef>(ApplicationRef);
        this.thread = injector.get<WebWorkerThreadService>(WebWorkerThreadService);
    }

    public get globalFilterValue(): string | null {
        return this.filterValue ? String(this.filterValue).trim() : null;
    }

    public get filterValueExist(): boolean {
        const keyFilterValues: string = Object.values(this.definition).reduce(
            (acc: string, next: string): string => acc + next,
            ''
        );

        return (this.globalFilterValue && this.globalFilterValue.length > 0) || keyFilterValues.length > 0;
    }

    public updateFilterTypeBy(type: TableFilterType, key?: string | null): void {
        if (key) {
            this.filterTypeDefinition = { ...this.filterTypeDefinition, [key]: type };
        }
    }

    public updateFilterValueBy(value: Any, key?: string | null): void {
        if (key) {
            this.definition = { ...this.definition, [key]: value };
        }
    }

    public reset(): void {
        this.definition = {};
        this.filterValue = null;
        this.state = new FilterStateEvent();
        this.filterTypeDefinition = {};
        this.filtering = false;
        this.previousFiltering = false;
        this.events.next({ value: null, type: null });
        this.resetEvents.next();
    }

    public changeFilteringStatus(): void {
        this.filtering = this.filterValueExist;

        if (this.filtering !== this.previousFiltering) {
            this.events.next({ value: null, type: null });
        }

        this.previousFiltering = this.filtering;
    }

    public openFilter(key: string, event: MouseEvent): void {
        this.state = { opened: true, key, position: { left: event.clientX, top: event.clientY } };
        this.filterOpenEvents.next();
        event.stopPropagation();
        event.preventDefault();
    }

    public closeFilter(): void {
        this.state = new FilterStateEvent();
        this.filterOpenEvents.next();
    }

    // eslint-disable-next-line max-lines-per-function
    public filter(source: TableRow[]): Promise<FilterWorkerEvent> {
        const type: string | TableFilterType | null = this.filterType;
        const value: string | null = this.globalFilterValue ? String(this.globalFilterValue).trim() : null;

        return new Promise(
            // eslint-disable-next-line max-lines-per-function
            (resolve: Resolver<FilterWorkerEvent>): void => {
                const message: FilterableMessage = {
                    source,
                    types: TableFilterType,
                    global: { value, type },
                    columns: {
                        values: this.definition,
                        types: this.filterTypeDefinition,
                        isEmpty: checkIsShallowEmpty(this.definition)
                    }
                };

                this.thread
                    .run<TableRow[], FilterableMessage>(filterAllWorker, message)
                    .then((sorted: TableRow[]): void => {
                        resolve({
                            source: sorted,
                            fireSelection: (): void => {
                                // eslint-disable-next-line max-nested-callbacks
                                window.setTimeout((): void => {
                                    this.events.next({ value, type });
                                    this.app.tick();
                                }, TIME_IDLE);
                            }
                        });
                    });
            }
        );
    }
}
