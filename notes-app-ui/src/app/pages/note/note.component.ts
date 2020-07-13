import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  note = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if(this.authService.user === null){
      this.router.navigate(["login"]);
    } else{
      this.dialog.open(LoadingDialogComponent);
      this.getNote();
    }
  }

  async getNote() {
    const id = this.route.snapshot.paramMap.get('id');
    const result = await this.apiService.getNote(id);
    this.dialog.closeAll();
    if(result.success){
      this.note = result.success;
    } else if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message:result.error.message}})
    }
  }

  async deleteNote() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if("true" === result){
        this.dialog.open(LoadingDialogComponent);
        const result = await this.apiService.deleteNote({
          id: this.note.noteId,
          attachment: this.note.attachment
        });
        this.dialog.closeAll();
        if(result.success){
          this.dialog.open(MessageDialogComponent, {data:{title:"SUCCESS", message: "Note deleted successfully!"}});
          this.router.navigate(["notes"]);
        } else if(result.error){
          this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}})
        }
      }
    });
  }

}
