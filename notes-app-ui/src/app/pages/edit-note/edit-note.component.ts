import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.css']
})
export class EditNoteComponent implements OnInit {
  note = null;
  readonly maxSize = 1 << 20;

  noteForm = new FormGroup({
    title: new FormControl('',[Validators.required]),
    content: new FormControl('',[Validators.required]),
    oldAttach: new FormControl({value: ''}),
    attachment: new FormControl('', [FileValidator.maxContentSize(this.maxSize)])
  });

  constructor(
    private authService: AuthService,
    private apiService: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
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
      this.noteForm.setValue({
        title: result.success.title,
        content: result.success.content,
        oldAttach: result.success.attachment ? result.success.attachment.filename : null,
        attachment: ''
      });
      this.note = result.success;
    } else if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message:"Could not get the note info."}})
    }
  }

  async handleSubmit() {
    this.dialog.open(LoadingDialogComponent);
    const result = await this.apiService.editNote({
      id: this.note.noteId,
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
      attachment: this.noteForm.value.attachment.files ? this.noteForm.value.attachment.files[0] : this.note.attachment
    });
    this.dialog.closeAll();
    if(result.success){
      if(result.successAttach){
        this.dialog.open(MessageDialogComponent, {data:{title:"SUCCESS", message:"Note edited successfully."}});
      } else if(result.errorAttach){
        this.dialog.open(MessageDialogComponent, {data:{title:"SUCCESS", message:`Note edited successfully but without the attachment.\n${result.errorAttach.message}`}});
      }
      this.router.navigate(["notes"]);
    }
    if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}})
    }
  }

}
