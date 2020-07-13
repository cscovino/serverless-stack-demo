import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileValidator } from 'ngx-material-file-input';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.css']
})
export class NewNoteComponent implements OnInit {
  readonly maxSize = 1 << 20;

  noteForm = new FormGroup({
    title: new FormControl('',[Validators.required]),
    note: new FormControl('',[Validators.required]),
    attachment: new FormControl('', [FileValidator.maxContentSize(this.maxSize)])
  });

  constructor(
    private authService: AuthService,
    private apiService: ApiService, 
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if(this.authService.user === null){
      this.router.navigate(["login"]);
    }
  }

  async handleSubmit() {
    const load = this.dialog.open(LoadingDialogComponent);
    const result = await this.apiService.createNote({
      title: this.noteForm.value.title,
      content: this.noteForm.value.note,
      file: this.noteForm.value.attachment.files ? this.noteForm.value.attachment.files[0] : ''
    });
    load.close();
    if(result.success){
      if(result.successAttach){
        this.dialog.open(MessageDialogComponent, {data:{title:"SUCCESS", message:"Note created successfully."}});
      } else if(result.errorAttach){
        this.dialog.open(MessageDialogComponent, {data:{title:"SUCCESS", message:`Note created successfully but without the attachment.\n${result.errorAttach.message}`}});
      }
      this.router.navigate(["notes"]);
    }
    if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}});
    }
  }

}
