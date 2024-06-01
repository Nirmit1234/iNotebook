const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the nodes using: GET "/api/notes/getusesr". Login required
router.get('/fetchallnodes',fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
        res.json(notes)

    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
   
})
// ROUTE 2: Adding a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('description','Description must be atleat 5 characters').isLength({min : 3}),], async (req,res)=>{
        try {
            const {title,description,tag} = req.body;
            // if there are errors,return Bad request and the errors
            const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(400).json({error:errors.array()});
                }   
            const note = new Note({title,description,tag, user : req.user.id})
            const saveNote  = await note.save()
            res.json(saveNote);
        } catch(error){
            console.error(error.message);
            res.status(500).send("Internal Server Error Occured");
        }
})
// ROUTE 3: Update an existing Node : PUT "/api/notes/updatenode". Login required
router.put('/updatenode/:id',fetchuser, async (req,res)=>{
    const {title,description,tag} = req.body;

    try{
        // Create a newNote object
    const newNote = {};
    if(title){
        newNote.title = title
    };
    if(description){
        newNote.description = description
    };
    if(tag){
        newNote.tag = tag
    };
    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
    
})
// ROUTE 4: Delete an existing Node : DELETE "/api/notes/deletenode/". Login required
router.delete('/deletenode/:id',fetchuser, async (req,res)=>{    
    try{
        // Find the note to be updated and to be delete it
    let note = await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }
    // Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
    
})
module.exports = router;
