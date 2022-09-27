const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { getStudentsByCourse, getSubjects, getStudent, getStudents, getStudentsByStatus, getStudentsByConclusionYear, filterStudentsByStatus, filterStudentsByConclusionYear, getConclusionYears } = require('./modules/alunos.js');
const { getCourses } = require('./modules/cursos');

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use(cors());

    next()
});

app.get('/cursos', cors(), async (request, response, next) => {
    let courses = getCourses()

    if (courses) {
        response.status(200);
        response.json(courses);
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos
app.get('/alunos', cors(), async (request, response, next) => {
    let studentsList = getStudents();

    if (studentsList) {
        response.status(200);
        response.json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos de um curso
app.get('/alunos/curso/?', cors(), async (request, response, next) => {
    let course = request.query.curso;
    let status = request.query.status;
    let conclusionDate = request.query.conclusao;
    
    let studentsList = getStudentsByCourse(course);
    if (status != undefined) {
        studentsList = await filterStudentsByStatus(studentsList, status);
    }
    if (conclusionDate != undefined) {
        studentsList = await filterStudentsByConclusionYear(studentsList, conclusionDate);
    }

    if (studentsList) {
        response.status(200);
        response.json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar as informacoes de um aluno pelo numero de matricula
app.get('/aluno/:matricula', cors(), async (request, response, next) => {
    let studentEnrollment = request.params.matricula;
    let studentInfo = getStudent(studentEnrollment);

    if (studentInfo) {
        response.status(200);
        response.json(studentInfo);
    } else {
        response.status(404);
    }
});

// Endpoint para listar as disciplinas de um aluno pela matricula
app.get('/:matricula/disciplinas', cors(), async (request, response, next) => {
    let studentEnrollment = request.params.matricula;
    let studentInfo = getStudent(studentEnrollment);

    let subjects = getSubjects(studentInfo)

    if (subjects) {
        response.status(200);
        response.json(subjects);
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um status
app.get('/alunos/status/:status', cors(), async (request, response, next) => {
    let status = request.params.status;
    let studentsList = getStudentsByStatus(status);

    if (studentsList) {
        response.status(200);
        response.json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um ano de conclusao
app.get('/alunos/conclusao/:data', cors(), async (request, response, next) => {
    let date = request.params.data;
    let studentsList = getStudentsByConclusionYear(date);

    if (studentsList) {
        response.status(200);
        response.json(studentsList);
    } else {
        response.status(404);
    }
});

app.get('/conclusao/?', cors(), async (request, response, next) => {
    let course = request.query.curso;
    let status = request.query.status;

    let conclusionYears = getConclusionYears(course, status);

    if (conclusionYears) {
        response.status(200);
        response.json(conclusionYears);
    } else {
        response.status(500);
    }
});

app.listen(8080, function() {
    console.log('Server waiting for requests...');
});