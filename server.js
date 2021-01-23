'use strict'; //https://www.youtube.com/watch?v=1FU7tGG01Y4&list=PLqRTLlwsxDL-e9RexPadqEVaaUgy-Ge8O&index=27&t=3s
//import packages
const express = require('express');
const morgan = require('morgan'); //loggin middleware

const sqlite = require('sqlite3'); //import sqlite
const db = new sqlite.Database('/home/diego/WA1/example/exams.sqlite', (err) => { console.error(err); }) //read selite file with callback for possible errors
//Create application
const app = express();
const port = 3000;

//Set-up logging
app.use(morgan('tiny'));

//Process body content
app.use(express.json());

//Set-up the 'client' component as a static website
app.use(express.static('client'));
app.get('/', (req, res) => {
    console.log('get index');
    res.redirect('/index.html')});

//**************************//
//*** REST API endpoints ***//
//**************************//

//Resources: Courses, Exams

//endpoint to GET /courses                          (ottenere la lista di corsi)
//Request body: empty
//Responde body: Array of objects
//Errors: none
 app.get('/courses', (req, res) => {
    //read from database
    const sql = 'SELECT * FROM course';
    
    db.all(sql, (err, rows) => {
        if(err){
            console.log(sql);
            throw err;
        }
        console.log('aaaaa '+rows);
        const courses = rows.map((row) => ({
            code : row.code,
            name : row.name,
            CFU : row.CFU

        }));
        res.json(courses);
    })
    
}); 

//endpoint to GET /courses/<course_code>            (ottenere corso da id)
//Request body: course code
//Responde body:object describing a course
//Errors: if the course doesn't exist, return a message 404
app.get('/courses/:code', (req, res) => { //definisco il parametro con ' : '
const course_code = req.params.code; //prendo il parametro dall'URL
    //read from database
    const sql = 'SELECT * FROM course WHERE code = ?';
    db.get(sql, [course_code], (err, row) => {  //fra parentesi quadre l'elenco dei parametri della query ' ? '
        if(err){
            throw err;
        }
        if(row)         { //se il dato esiste
            res.json({code: row.code, name: row.name, CFU: row.CFU})
        } else { //se il dato non esiste
            res.status(404).json({reason : 'Course not found'});
        }
        
    })
    
}); 


//  ''     to GET /exams                            (ottenere la lista esami)
//  ''     to GET /exams/<exam_id>                  (ottenere esame da id)
//         to POST /exams                           (aggiungere esame)

//**************************//
//******Fine REST API*******//
//**************************//

//Activate Web Browser
app.listen(port, () => console.log('Example app listening at http://localhost:${port}'));


