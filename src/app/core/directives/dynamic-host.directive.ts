import { Directive, ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';

@Directive({
	selector: '[tqDynamicHost]'
})
export class DynamicHostDirective {
	constructor(private viewContainerRef: ViewContainerRef) { }

	createComponent = <T>(componentType: ComponentFactory<T>): ComponentRef<T> =>
		this.viewContainerRef.createComponent(componentType)

	clear = (): void => this.viewContainerRef.clear();
}
