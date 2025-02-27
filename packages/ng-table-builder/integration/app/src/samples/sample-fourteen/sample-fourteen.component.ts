import { Any } from '@angular-ru/common/typings';
import { TableBuilderComponent, TableRow } from '@angular-ru/ng-table-builder';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MocksGenerator } from '../../../../tests/helpers/utils/mocks-generator';
import { CodeDialogComponent } from '../../shared/dialog/code-dialog.component';

declare const hljs: Any;

// noinspection CssUnusedSymbol
@Component({
    selector: 'sample-fourteen',
    templateUrl: './sample-fourteen.component.html',
    styles: [
        // tslint:disable-next-line:component-max-inline-declarations
        `
            .filter-example .table-grid__column {
                text-transform: uppercase;
            }

            .filter-example .table-grid__cell > * {
                font-size: 12px;
            }

            .filter-example .table-grid__header-cell {
                min-height: 50px;
                max-height: 50px;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleFourteenComponent implements OnInit, AfterViewInit {
    @ViewChild('table', { static: false })
    public table!: TableBuilderComponent;

    public data: TableRow[] = [];
    constructor(public readonly dialog: MatDialog, private readonly cd: ChangeDetectorRef) {}

    public ngOnInit(): void {
        const rows: number = 10000;
        const cols: number = 59;
        MocksGenerator.generator(rows, cols).then((data: TableRow[]): void => {
            this.data = data;
            this.cd.detectChanges();
        });
    }

    public ngAfterViewInit(): void {
        document.querySelectorAll('pre code').forEach((block: Any): void => {
            hljs.highlightBlock(block);
        });
    }

    public clearFilter(): void {
        this.table.filterable.reset();
    }

    // eslint-disable-next-line max-lines-per-function
    public showSample(): void {
        this.dialog.open(CodeDialogComponent, {
            data: {
                title: 'Overview selection table',
                description:
                    'In order to use the API for string highlighting, you can use the table.selection service. <br>' +
                    'In more detail you can read in the guide.',
                code: `
    <ngx-filter #filter>
        <div class="my-filter">
            <mat-form-field appearance="outline">
                <mat-label>Find options</mat-label>
                <mat-select
                    [value]="table.filterable.filterTypeDefinition[filter.state.key!]"
                    (valueChange)="table.filterable.updateFilterTypeBy($event, filter.state.key); table.filter()"
                >
                    <mat-option *ngFor="let type of table.filterable.types | keyvalue" [value]="type.value">
                        {{ type.key }}
                    </mat-option>
                </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Filter by {{ filter.state.key! | uppercase }}</mat-label>
                <input
                    matInput
                    name="width"
                    autocomplete="off"
                    [ngModel]="table.filterable.definition[filter.state.key!]"
                    (ngModelChange)="table.filterable.updateFilterValueBy($event, filter.state.key); table.filter()"
                />
                <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
        </div>
    </ngx-filter>
                    `
            },
            height: '650px',
            width: '900px'
        });
    }
}
