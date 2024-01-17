/**
 * @description this is a sharable module to fix the cirlular issue
 * source: http://www.angulartutorial.net/2020/02/how-to-create-and-use-shared-module-in.html
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from 'libs/components/src/lib/icons/icons.component';



/** should be added to the root tree, or at most desired tree */
@NgModule({
  /** import your shared components here */
  declarations: [IconsComponent] ,

   /** import your shared modules here */
  imports: [
    CommonModule
  ],
  exports: [IconsComponent]
})
export class SharedComponentsModule {}

