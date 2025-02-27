import { Any } from '@angular-ru/common/typings';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

declare const hljs: Any;

@Component({
    selector: 'guide',
    templateUrl: './guide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideComponent implements AfterViewInit {
    public ngAfterViewInit(): void {
        document.querySelectorAll('pre code').forEach((block: Any): void => {
            hljs.highlightBlock(block);
        });
    }
}
