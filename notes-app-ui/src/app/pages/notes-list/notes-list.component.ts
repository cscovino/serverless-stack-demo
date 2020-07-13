import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes = [];

  constructor(
    private authService: AuthService, 
    private apiService: ApiService, 
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(this.authService.user === null){
      this.router.navigate(["login"]);
    } else{
      this.dialog.open(LoadingDialogComponent);
      this.getNotes();
    }
  }

  async getNotes() {
    const result = await this.apiService.getNotes();
    this.dialog.closeAll();
    if(result.success){
      this.notes = result.success;
    } else if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message:"Could not get the note info."}})
    }
  }

}
