import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LottieModule } from 'ngx-lottie';
import { AmplifyService } from 'aws-amplify-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './pages/signup/signup.component';
import { NewNoteComponent } from './pages/new-note/new-note.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoteComponent } from './pages/note/note.component';
import { EditNoteComponent } from './pages/edit-note/edit-note.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';

export function playerFactory() {
   return import('lottie-web');
 }

@NgModule({
   declarations: [
      AppComponent,
      TopBarComponent,
      NotesListComponent,
      NotFoundComponent,
      LoginComponent,
      SignupComponent,
      NewNoteComponent,
      NoteComponent,
      EditNoteComponent,
      ConfirmDialogComponent,
      LoadingDialogComponent,
      MessageDialogComponent
   ],
   entryComponents: [
      ConfirmDialogComponent,
      LoadingDialogComponent,
      MessageDialogComponent
   ],
   imports: [
      ReactiveFormsModule,
      BrowserModule,
      BrowserAnimationsModule,
      MatToolbarModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MaterialFileInputModule,
      MatIconModule,
      MatCardModule,
      MatTooltipModule,
      MatDialogModule,
      LottieModule.forRoot({
         player: playerFactory,
         useCache: true,
      }),
      RouterModule.forRoot([
         { path: 'login', component: LoginComponent },
         { path: 'signup', component: SignupComponent },
         { path: 'new', component: NewNoteComponent },
         { path: 'notes', component: NotesListComponent },
         { path: 'notes/:id', component: NoteComponent },
         { path: 'edit/:id', component: EditNoteComponent },
         { path: '', redirectTo: '/notes', pathMatch: 'full' },
         { path: '**', component: NotFoundComponent },
      ])
   ],
   providers: [AmplifyService],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
