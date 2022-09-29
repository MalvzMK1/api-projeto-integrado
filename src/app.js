const express = require('express');
const cors = require('cors');

const { getStudentsByCourse, getSubjects, getStudent, getStudents, getStudentsByStatus, getStudentsByConclusionYear, filterStudentsByStatus, filterStudentsByConclusionYear, getConclusionYears } = require('../modules/alunos.js');
const { getCourses } = require('../modules/cursos');

const app = express()

app.use(express.json()) // body-parser

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use(cors());

    next()
});

app.get('/.netlify/functions/api/cursos', cors(), async (request, response, next) => {
    const courses = getCourses()

    if (courses) {
        response.status(200).json(courses);
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos
app.get('/.netlify/functions/api/alunos', cors(), async (request, response, next) => {
    const studentsList = getStudents();

    if (studentsList) {
        response.status(200).json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos de um curso
app.get('/.netlify/functions/api/alunos/curso/?', cors(), async (request, response, next) => {
    const course = request.query.curso;
    const status = request.query.status;
    const conclusionDate = request.query.conclusao;
    
    let studentsList = getStudentsByCourse(course);
    if (status != undefined) {
        studentsList = await filterStudentsByStatus(studentsList, status);
    }
    if (conclusionDate != undefined) {
        studentsList = await filterStudentsByConclusionYear(studentsList, conclusionDate);
    }

    if (studentsList) {
        response.status(200).json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar as informacoes de um aluno pelo numero de matricula
app.get('/.netlify/functions/api/aluno/:matricula', cors(), async (request, response, next) => {
    const studentEnrollment = request.params.matricula;
    const studentInfo = getStudent(studentEnrollment);

    if (studentInfo) {
        response.status(200).json(studentInfo);
    } else {
        response.status(404);
    }
});

// Endpoint para listar as disciplinas de um aluno pela matricula
app.get('/.netlify/functions/api/:matricula/disciplinas', cors(), async (request, response, next) => {

    const studentEnrollment = request.params.matricula;
    const studentInfo = getStudent(studentEnrollment);

    const subjects = getSubjects(studentInfo)

    if (subjects) {
        response.status(200).json(subjects);
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um status
app.get('/.netlify/functions/api/alunos/status/:status', cors(), async (request, response, next) => {
    const { status } = request.params;
    
    const studentsList = getStudentsByStatus(status);

    if (studentsList) {
        response.status(200).json(studentsList);
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um ano de conclusao
app.get('/.netlify/functions/api/alunos/conclusao/:data', cors(), async (request, response, next) => {
    const { data } = request.params;
    
    const studentsList = getStudentsByConclusionYear(data);

    if (studentsList) {
        response.status(200).json(studentsList);
    } else {
        response.status(404);
    }
});

app.get('/.netlify/functions/api/conclusao/?', cors(), async (request, response, next) => {
    const { curso, status } = request.query;

    const conclusionYears = getConclusionYears(curso, status);

    if (conclusionYears) {
        response.status(200).json(conclusionYears);
    } else {
        response.status(500);
    }
});

module.exports = app;