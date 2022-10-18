import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {

  note!: Note;
  noteId!: number;
  new!: boolean;

  constructor(
    private notesService: NotesService, 
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    //we want to find out if we are creating a new note or editing an existing one
    this.route.params.subscribe((params: Params)=>{
      this.note = new Note();
      if(params['id']){
        this.note = this.notesService.get(params['id']);
        this.noteId = params['id'];
        this.new = false;
      }else{
        this.new = true;
      }
    })
  }

  onSubmit(form: NgForm)
  {
    //save the note
    if(this.new){
      this.notesService.add(form.value);
    }else{
      this.notesService.update(this.noteId, form.value.title, form.value.body);
    }
    this.router.navigateByUrl('/');
    
  }

  onCancel(){
    this.router.navigateByUrl('/');
  }
}
