import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Angular Material
import { MatSliderModule } from '@angular/material/slider';

//eigenes Services
import { BackendService } from './services/backend.service';
import { ResultfilterService } from './services/resultfilter.service';
import { JsondataService } from './services/jsondata.service';
import { ViewControlService } from './services/view-control.service';

//eigenes Pipes
import { ModeFilterPipe } from './pipes/mode-filter.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { TimeformatterPipe } from './pipes/timeformatter.pipe';
import { FileNamePipe } from './pipes/file-name.pipe';

//eigenes Directives
import { ToggleCheckboxDirective } from './directives/toggle-checkbox.directive';

//eigene Komponenten
import { AppComponent } from './components/app/app.component';
import { SearchComponent } from './components/search/search.component';
import { ResultlistComponent } from './components/resultlist/resultlist.component';
import { ModefilterComponent } from './components/modefilter/modefilter.component';
import { SearchfilterComponent } from './components/searchfilter/searchfilter.component';
import { SortfilterComponent } from './components/sortfilter/sortfilter.component';
import { SelectmodeComponent } from './components/selectmode/selectmode.component';
import { CurrentplayedplaylistinspectorComponent } from './components/currentplayedplaylistinspector/currentplayedplaylistinspector.component';
import { PlayercontrolComponent } from './components/playercontrol/playercontrol.component';
import { PicontrolComponent } from './components/picontrol/picontrol.component';
import { ResultlistinspectorComponent } from './components/resultlistinspector/resultlistinspector.component';
import { DebuginspectorComponent } from './components/debuginspector/debuginspector.component';
import { ToggletrackviewComponent } from './components/toggletrackview/toggletrackview.component';
import { RandomPlaybackComponent } from './components/random-playback/random-playback.component';
import { VolumeControlComponent } from './components/volume-control/volume-control.component';
import { VolumeSliderComponent } from './components/volume-slider/volume-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultlistComponent,
    TimeformatterPipe,
    ModefilterComponent,
    SearchfilterComponent,
    SortfilterComponent,
    SelectmodeComponent,
    CurrentplayedplaylistinspectorComponent,
    PlayercontrolComponent,
    PicontrolComponent,
    ResultlistinspectorComponent,
    DebuginspectorComponent,
    ToggletrackviewComponent,
    ModeFilterPipe,
    SearchFilterPipe,
    OrderByPipe,
    ToggleCheckboxDirective,
    RandomPlaybackComponent,
    VolumeControlComponent,
    VolumeSliderComponent,
    FileNamePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    MatSliderModule,
    RouterModule.forRoot([
      { path: 'search/:mode', component: SearchComponent },
      { path: '**', redirectTo: '/search/default', pathMatch: 'full' }
    ]),
  ],
  providers: [BackendService, ResultfilterService, JsondataService, ViewControlService, ModeFilterPipe, SearchFilterPipe, OrderByPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }