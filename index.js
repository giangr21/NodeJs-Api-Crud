const express = require('express');
const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

function logRequests (req, res, next) {
    numberOfRequests++;
    console.log(`Número de requisições: ${numberOfRequests}`);
    return next();
};

function checkProjectExists (req, res, next) {
    const { id } = req.params;
    const project = projects.find(project => project.id === id);
    if (!project) {
        return res.status(400).json({error: 'Project not found!'});
    }
    return next();
};

server.use(logRequests);

server.post('/projects', (req,res) => {
	// Cadastrar um projeto
    // receber no body um id e um title.
    console.log(req.body)
    const {id,title,tasks} = req.body;
    const project = {id,title,tasks};
    projects.push(project);
    return res.json(projects);
});

server.get('/projects', (req,res) => {
    // Listar projetos
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req,res) => {
    // Alterar o titulo pelo id.
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id === id);
    project.title = title;
    return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req,res) => {
    // Excluir projeto pelo id
    const { id } = req.params;
    const index = projects.findIndex(project => project.id === id);
    projects.splice(index, 1);
    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req,res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id === id);
    project.tasks.push(title);
    return res.json(project);
});

server.listen(3000);