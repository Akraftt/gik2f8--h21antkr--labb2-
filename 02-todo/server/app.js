const express = require('express');
const app = express();
const fs = require('fs/promises');
const PORT = 5000;
app

  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await fs.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await fs.readFile('./tasks.json');
    /* Innehållet i filen är de uppgifter som hittills är sparade. För att kunna behandla listan av uppgifter i filen som JavaScript-objekt behövs JSON.parse. Parse används för att översätta en buffer eller text till JavaScript */
    const currentTasks = JSON.parse(listBuffer);
    /* Skapar en variabel för att kunna sätta id på den nya uppgiften */
    let maxTaskId = 1;
    /* Om det finns några uppgifter sedan tidigare, dvs. currentTasks existerar och är en lista med en längd större än 0 ska ett nytt id räknas ut baserat på de som redan finns i filen */
    if (currentTasks && currentTasks.length > 0) {
      /* Det görs genom array.reduce() som går igenom alla element i listan och tar fram det högsta id:t. Det högsta id:t sparas sedan i variabeln maxTaskId */
      maxTaskId = currentTasks.reduce(
        /* För varje element i currentTasks anropas en callbackfunktion som får två parametrar, maxId och currentElement. maxId kommer att innehålla det id som för närvarande är högst och currentElement representerar det aktuella element i currentTasks som man för närvarande kontrollerar.  */
        (maxId, currentElement) =>
          /* Om id:t för den aktuella uppgiften är större än det i variabeln maxId, sätts maxId om till det id som nu är högst. maxId är från början satt till värdet av maxTaskId (1, enligt rad 53.).  */
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    /* En ny uppgift skapas baserat på den uppgift som skickades in och som hämtades ur req.body, samt egenskapen id som sätts till det högsta id av de uppgifter som redan finns (enligt uträkning med hjälp av reduce ovan) plus ett. Det befintliga objektet och det nya id:t slås ihop till ett nytt objekt med hjälp av spreadoperatorn ... */
    const newTask = { id: maxTaskId + 1, ...task };
    /* Om currentTasks finns - dvs det finns tidigare lagrade uppgifter,  skapas en ny array innehållande tidigare uppgifter (varje befintlig uppgift i currentTasks läggs till i den nya arrayen med hjälp av spreadoperatorn) plus den nya uppgiften. Om det inte tidigare finns några uppgifter, skapas istället en ny array med endast den nya uppgiften.  */
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    /* Den nya listan görs om till en textsträng med hjälp av JSON.stringify och sparas ner till filen tasks.json med hjälp av fs-modulens writeFile-metod. Anropet är asynkront så await används för att invänta svaret innan koden går vidare. */
    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    /* Det är vanligt att man vid skapande av någon ny resurs returnerar tillbaka den nya sak som skapades. Så den nya uppgiften skickas med som ett success-response. */
    res.send(newTask);
  } catch (error) {
    /* Vid fel skickas istället statuskod 500 och information om felet.  */
    res.status(500).send({ error: error.stack });
  }
});
/* Express metod för att lyssna efter DELETE-anrop heter naturligt delete(). I övrigt fungerar den likadant som get och post */

/* Route-adressen som specificeras i delete har /:id i tillägg till adressen. Det betyder att man i adressen kan skriva task följt av ett / och sedan något som kommer att sparas i en egenskap vid namn id. :id betyder att det som står efter / kommer att heta id i requestobjektet. Hade kunnat vara vad som helst. Så här möjliggörs att lyssna efter DELETE-anrop på exempelvis url:en localhost:5000/task/1 där 1 då skulle motsvara ett id på den uppgift man vill ta bort */
app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      /* När den nya listan har skrivits till fil skickas ett success-response  */
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      /* Om det inte fanns något i filen sedan tidigare skickas statuskod 404. 404 används här för att det betyder "Not found", och det stämmer att den uppgift som man ville ta bort inte kunde hittas om listan är tom. Vi har dock inte kontrollerat inuti en befintlig lista om det en uppgift med det id som man önskar ta bort faktiskt finns. Det hade man också kunnat göra. */
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva en funktion som likt post eller delete tar kan hantera PUT- eller PATCH-anrop 
(du får välja vilket, läs på om vad som verkar mest vettigt för det du ska göra) för att kunna markera uppgifter som färdiga. Den nya statusen - 
completed true eller falase - kan skickas i förfrågans body (req.body) tillsammans med exempelvis id så att man kan söka fram en given uppgift ur listan, 
uppdatera uppgiftens status och till sist spara ner listan med den uppdaterade uppgiften */

/* Observera att all kod rörande backend för labb 2 ska skrivas i denna fil och inte i app.node.js. 
App.node.js är bara till för exempel från lektion 5 och innehåller inte någon kod som används vidare under lektionerna. */

app.put('/tasks', async (request, response) => {
  const originalTask = request.body;
  
  // skapa en kopia av task
  const updatedTask = {
    id: originalTask.id,
    title: originalTask.title,
    description: originalTask.description,
    dueDate: originalTask.dueDate,
    completed: originalTask.completed
  };

  try {
    const currentTaskList = await fs.readFile('./tasks.json');                      // läser current task list från taks.json
    const currentTasks = JSON.parse(currentTaskList);                               // prse JSON till jJavascriptObject
    const filteredTasks = currentTasks.filter(task => task.id != updatedTask.id);   // Nya lista med updated, filter orginal och lägger till updated task
    const newTaskList = [...filteredTasks, updatedTask];                            
    await fs.writeFile('./tasks.json', JSON.stringify(newTaskList));                // skriver nya task list till tasks.json
    response.send(updatedTask);                                                     // skickar updated task back till client
  } catch (err) {
    console.log(err.stack);                                                         // log ifall det blir någon form utav errors.
  }
});



/***********************Labb 2 ***********************/

/* Med app.listen säger man åte servern att starta. Första argumentet är port - dvs. det portnummer man vill att servern ska köra på. Det sattes till 5000 på rad 9. Det andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs bara ett meddelande ut som berättar att servern kör, så att man får feedback på att allt körts igång som det skulle. */
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
