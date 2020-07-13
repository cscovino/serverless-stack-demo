import { Injectable } from '@angular/core';
import { API, Storage } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  async getNotes() {
    try {
      const notes = await API.get("notes", "/notes", {});
      return {error: null, success: notes};
    } catch (error) {
      //console.log("ERROR API", error);
      return {error: error, success: null};      
    }
  }

  async getNote(id) {
    try {
      const note = await API.get("notes", `/notes/${id}`, {});
      if(note.attachment){
        note.attachmentURL = await Storage.vault.get(note.attachment.key);
      }
      return {error: null, success: note};
    } catch (error) {
      //console.log("ERROR API", error);
      return {error: error, success: null};      
    }
  }

  async createNote(payload) {
    try {
      const attachment = payload.file  instanceof File ? await this.s3Upload(payload.file) : null;
      await API.post("notes", "/notes",{
        body: {
          title: payload.title,
          content: payload.content,
          attachment: attachment ? attachment.success ? attachment.success : null : null
        }
      });
      return {
        error: null, 
        success: true, 
        errorAttach: attachment ? null : attachment.error ? attachment.error : null, 
        successAttach: attachment ? true : attachment.success ? true : null
      };
    } catch (error) {
      //console.log("ERROR API", error.message);
      return {error: error.message === "attachment is null" ? null : error, success: error.message === "attachment is null" ? true : null};
    }
  }

  async editNote(payload) {
    try {
      const attachment = payload.attachment.key ? payload.attachment : await this.s3Upload(payload.attachment);
      await API.put("notes", `/notes/${payload.id}`,{
        body: {
          title: payload.title,
          content: payload.content,
          attachment: attachment.key ? attachment : attachment.success ? attachment.success : ''
        }
      });
      return {
        error: null, 
        success: true, 
        errorAttach: attachment.error ? attachment.error : null, 
        successAttach: attachment.key ? true : attachment.success ? true : null
      };
    } catch (error) {
      //console.log("ERROR API", error);
      return {error: error, success: null};   
    }
  }

  async deleteNote(payload) {
    try {
      await API.del("notes", `/notes/${payload.id}`,{});
      if(payload.attachment) await Storage.remove(payload.attachment.key, {level: 'private'});
      return {error: null, success: true};
    } catch (error) {
      //console.log("ERROR API", error);
      return {error: error, success: null};     
    }
  }

  async s3Upload(file) {
    //console.log(file)
    try {
      const filename = `${Date.now()}-${file.name}`;
      const stored = await Storage.vault.put(filename, file, {
        contentType: file.type,
      });
      stored["filename"] = file.name;
      //console.log("STORED", stored);
      return {error: null, success: stored};      
    } catch (error) {
      //console.log("ERROR S3", error);
      return {error: error, success: null};      
    }
  }

}
