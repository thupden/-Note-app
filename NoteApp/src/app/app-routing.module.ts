import { NgModule } from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import { MainLayoutComponent } from "./pages/main-layout/main-layout.component";
import { NodeDetailsComponent } from "./pages/node-details/node-details.component";
import { NotesListComponent } from "./pages/notes-list/notes-list.component";

const routes: Routes =[
   {path: '', component: MainLayoutComponent, children: [
    {path: '', component: NotesListComponent},
    {path:'new', component: NodeDetailsComponent},
    {path: ':id', component: NodeDetailsComponent}
   ]}
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}