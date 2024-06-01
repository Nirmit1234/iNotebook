import { useState } from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) =>{
    const host  = "http://localhost:5000"
    const notesIntial = [];
    const[notes,setnotes] = useState(notesIntial)

     // Get all Notes
     const getNote = async ()=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/fetchallnodes`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                "auth-token" : localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        setnotes(json);
    }


    // Add a Note
    const addNote = async (title,description,tag)=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/addnote`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });
        const note  = await response.json();
        setnotes(notes.concat(note))
    }
    // Delete a Note
    const deleteNote = async (id)=>{
        // TODO API CALL
        const response = await fetch(`${host}/api/notes/deletenode/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                "auth-token" : localStorage.getItem('token')
            }
        });
        const json  = response.json();
        console.log(json);
        const newNotes = notes.filter((note)=>{return note._id !== id})
        setnotes(newNotes)
    }

    // Edit a Note
const editNote = async (id, title, description, tag) => {
    // API CALL
        const response =  await fetch(`${host}/api/notes/updatenode/${id}`, {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        console.log(json);
        let newNotes = JSON.parse(JSON.stringify(notes));
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break; 
            }
        }
        setnotes(newNotes);
    };
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
            {props.children}
        </NoteContext.Provider>
    );
}
export default NoteState;






