const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repos = [];

function TestID(request, response, next){
   const {id} = request.params;

   if(!isUuid(id)){
     return response.status(400).json({ msg: 'ID de repositório inválido!'})
   }

   return next();
}

app.use('/repositories/:id', TestID)

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const repo = title 
    ? repos.filter(repo => repo.title.toUpperCase().includes(title.toUpperCase()))
    : repos;
  return response.json(repo)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0};

  repos.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repos.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({ msg: 'Repositório não encontrado!'})
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repos[repoIndex].likes
  }

  repos[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repoIndex = repos.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({ msg: 'Repository not found!'})
  }

  repos.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repoIndex = repos.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({ msg: 'Repository not found!'})
  }

  repos[repoIndex].likes += 1;
  
  return response.json(repos[repoIndex])
  // return response.status(204).send()

});

module.exports = app;