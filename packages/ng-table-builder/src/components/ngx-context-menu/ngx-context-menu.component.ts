import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { ContextMenuState } from '../../services/context-menu/context-menu.interface';
import { AbstractModalViewLayer } from '../common/abstract-modal-view-layer.directive';

const SIZE: number = 300;
const MAX_HEIGHT: number = 400;

@Component({
    selector: 'ngx-context-menu',
    templateUrl: './ngx-context-menu.component.html',
    styleUrls: ['./ngx-context-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NgxContextMenuComponent extends AbstractModalViewLayer<ContextMenuState> implements OnInit {
    @Input() public width: number | null = SIZE;
    @Input() public height: number | null = SIZE;
    @Input('max-height') public maxHeight: number = MAX_HEIGHT;

    constructor(protected readonly cd: ChangeDetectorRef, injector: Injector) {
        super(cd, injector);
    }

    public get state(): ContextMenuState {
        return this.contextMenu.state;
    }

    public ngOnInit(): void {
        this.subscription = this.contextMenu.events.subscribe((): void => this.update());
    }

    public close(event: MouseEvent): void {
        this.contextMenu.close();
        event.preventDefault();
    }
}
