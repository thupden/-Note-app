import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotesService } from 'src/app/shared/notes.service';
import {Note} from '../../shared/note.model';
import {trigger, transition,style,animate, query,stagger} from '@angular/animations';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim',[
        //entry animation
        transition('void=>*',[
          //initial state
          style({
            height: 0,
            opacity: 0,
            transform: 'scale(0.85)',
            'margin-bottom': 0,

            //we have to expand out the padding properties
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            paddingLeft: 0
          }),
          //we first want to animate the spacing which includes height and margin
          animate('50ms', style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingLeft: '*',
            paddingRight:'*'
          })),
          animate(68)
        ]),

        transition('*=>void',[
          //first scale up
          animate(50, style({
            transform: 'scale(1.05)'
          })),
          animate(50, style({
            transform: 'scale(1)',
            opacity: 0.75
          })),
          //scale down and fade out animation
          animate('120ms ease-out', style({
            transform: 'scale(0.68)',
            opacity: 0
          })),
          //then animate the spacing includeing height ,margin and padding
          animate('150ms ease-out', style({
            height: 0,
            opacity: 0,
            'margin-bottom': 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            paddingLeft: 0
          }))
        ])
    ]),
    trigger('listAnim',[
      transition('*=>*',[
        query(':enter',[
          style({
            opacity:0,
            height:0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true

        })
      ])
    ])
  ]
})

export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;
  constructor(private noteService: NotesService) { }

  ngOnInit(): void {
    //retrive all notes from note service
    this.notes = this.noteService.getAll();
    // this.filteredNotes = this.noteService.getAll();
    this.filter('');
  }

  deleteNote(note: Note){
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note)
  {
    let noteId = this.noteService.getId(note);
    return noteId;
  }
  filter(query: string){
    query: query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    //split up the search query into individual words
    let terms: string[] = query.split(' '); //split on spaces
    //remove duplicate search terms
    terms = this.removeDuplicates(terms);
    //compile all relevant results into the allResults array

    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      //append results to the allResults array
      allResults =[...allResults,...results];
    });
    //allResults will include duplicate notes
    //because a particular note can be the result of many search terms
    //but we don't want to show the same note multiple times ont the UI
    //so we first must remove the duplicates
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    //sort by relevancy
    this.sortByRelevancy(allResults);

  }

  removeDuplicates(arr: Array<any>): Array<any>{
    let uniqueResults: Set<any> = new Set<any>();
    //loop through the input array and add the items to the set
    arr.forEach(e=>uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string):Array<Note>{
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note=>{
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]){
    //This methos will calculate the relevancy of a note based on the number of times it appears in
    //the search results

    let noteCountObj: Record<number,number>= {};//format = key:value => noteId:number (note object id: count)

    searchResults.forEach(note => {
      let noteId = this.noteService.getId(note);//get the notes id

      if(noteCountObj[noteId]){
        noteCountObj[noteId]+=1;
      }else{
        noteCountObj[noteId]=1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) =>{
      let aId = this.noteService.getId(a);
      let bId = this.noteService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }
}
