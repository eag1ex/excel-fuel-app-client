/**
 * import required material design module
 */

import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
// import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

const ANGULAR_MATERIAL_MODULES = [
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
       MatToolbarModule,
   MatTooltipModule,
//     MatSlideToggleModule,
        MatAutocompleteModule,
//     MatButtonToggleModule,
     MatInputModule,
    MatFormFieldModule,
//     MatSelectModule,
      MatIconModule,
//     MatListModule,
//     MatMenuModule,
    MatButtonModule,
//     MatRippleModule,
//     // MatCardModule,
     MatChipsModule,
     MatProgressSpinnerModule,
//     MatProgressBarModule,
    MatDividerModule,
];

@NgModule({
    imports: [ANGULAR_MATERIAL_MODULES],
    exports: [ANGULAR_MATERIAL_MODULES],
})
export class MaterialModule {}
