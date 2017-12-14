import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete/autocomplete';
import { MapComponent } from './map/map';
@NgModule({
	declarations: [AutocompleteComponent,
    MapComponent],
	imports: [],
	exports: [AutocompleteComponent,
    MapComponent]
})
export class ComponentsModule {}
