import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete/autocomplete';
import { MapComponent } from './map/map';
import { ActivityFabComponent } from './activity-fab/activity-fab';
@NgModule({
	declarations: [AutocompleteComponent,
    MapComponent,
    ActivityFabComponent],
	imports: [],
	exports: [AutocompleteComponent,
    MapComponent,
    ActivityFabComponent]
})
export class ComponentsModule {}
