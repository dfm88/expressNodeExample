//MODULO DAO

const sqlite = require('sqlite3'); //import sqlite
const db = new sqlite.Database('/home/diego/WA1/example/exams.sqlite', (err) => { console.error(err); }) //read selite file with callback for possible errors


exports.listCourses = function () {
	return new Promise((resolve, reject) => {
		//read from database
		const sql = 'SELECT * FROM course';
		
		db.all(sql, (err, rows) => {
			if(err){
				console.log(sql);
				reject(err);
			}
			console.log('aaaaa '+rows);
			const courses = rows.map((row) => ({
				code : row.code,
				name : row.name,
				CFU : row.CFU

			}));
			
			resolve(courses);
        });
    });
};


exports.readCourseByCode = function(code) {
	return new Promise((resolve, reject) => {
		
		//read from database
		const sql = 'SELECT * FROM course WHERE code = ?';
		db.get(sql, [code], (err, row) => {  //fra parentesi quadre l'elenco dei parametri della query ' ? '
			if(err){
				reject(err);
			}
			if(row) { //se il dato esiste
				resolve({code: row.code, name: row.name, CFU: row.CFU})
			} else { //se il dato non esiste
				resolve({reason : 'Course not found'});
			}
			
        });
    });
};


exports.createExam = function(exam) {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO exam{course_code, date, score) VALUES (?, DATE(?), ?)';
		db.run(sql, [exam.coursecode, exam.date, exam.score], (err) => {
			if(err) {
				reject(err);
			}
			//alternativamente ad esempio chiediamo l'ultimo id resolve(this.lastID)
			resolve(null); 
		});
	});
	
};

exports.listExams = function () {
	return new Promise((resolve, reject)=> {
		//read from database
		const sql = 'SELECT * FROM exam';
		
		db.all(sql, (err, rows) => {
			if(err){
				console.log(sql);
				reject(err);
			}
			console.log('aaaaa '+rows);
			const exams = rows.map((row) => ({
				code : row.code,
				score : row.score,
				date : row.date

			}));
			
			resolve(exams);
        });
    });
};





