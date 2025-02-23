import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Inject,
    Injector,
    Input,
    OnDestroy,
    TemplateRef,
} from '@angular/core';
import {TuiPortalService} from '@taiga-ui/cdk';
import {TuiHorizontalDirection} from '@taiga-ui/core';
import {PolymorpheusTemplate} from '@tinkoff/ng-polymorpheus';
import {TuiSidebarComponent} from './sidebar.component';

@Directive({
    selector: '[tuiSidebar]',
})
export class TuiSidebarDirective extends PolymorpheusTemplate<{}> implements OnDestroy {
    @Input('tuiSidebarDirection')
    direction: TuiHorizontalDirection = 'left';

    @Input('tuiSidebarAutoWidth')
    autoWidth = false;

    @Input()
    set tuiSidebar(open: boolean) {
        if (open) {
            this.show();
        } else {
            this.hide();
        }
    }

    private sidebarRef: ComponentRef<TuiSidebarComponent> | null = null;

    constructor(
        @Inject(TemplateRef) readonly content: TemplateRef<{}>,
        @Inject(Injector) private readonly injector: Injector,
        @Inject(ComponentFactoryResolver)
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        @Inject(TuiPortalService) private readonly portalService: TuiPortalService,
        @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
    ) {
        super(content, changeDetectorRef);
    }

    ngOnDestroy() {
        this.hide();
    }

    private show() {
        if (this.sidebarRef !== null) {
            return;
        }

        const componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(TuiSidebarComponent);

        this.sidebarRef = this.portalService.add(componentFactory, this.injector);
        this.sidebarRef.changeDetectorRef.detectChanges();
    }

    private hide() {
        if (this.sidebarRef === null) {
            return;
        }

        this.portalService.remove(this.sidebarRef);
        this.sidebarRef = null;
    }
}
