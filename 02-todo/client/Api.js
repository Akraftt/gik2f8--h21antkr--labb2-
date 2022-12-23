/* I denna fil finns en klass för att hantera API-förfrågningar mot server (servern är det backend som skapades i lektion 5).

Om ni vill starta precis denna kod måste ni först installera om node-paket och starta upp servern. Servern, såsom den ser ut i slutet av Lektion 6, 
finns i denna samma zip-fil. Om ni skulle köra denna kod mot backend såsom det såg ut efter Lektion 5, skulle det inte fungera, eftersom detta är koden 
såsom den ser ut efter Lektion 6 och några små förändringar gjordes även i servern under Lektion 6. 

Gör då följande här i VS Code: 
1. Öppna en terminal
2. Skriv "cd 02-todo/server" (utan citattecken) och sedan enter
3. Skriv "npm install" (utan citattecken) och sedan enter
3. Skriv "node app.js" (utan citattecken) och enter. 

Om servern startats korrekt syns nu texten "Server running on http://localhost:5000". */

class Api {
  url = '';
  constructor(url) {
    this.url = url;
  }

  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);

    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    }
    );


    return (
      fetch(request)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }

  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {
    console.log(`Removing task with id ${id}`);
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  /***********************Labb 2 ***********************/
  /* Här skulle det vara lämpligt att skriva en metod likt getAll, create och delete anropas från script.js 
  när någon har markerat en uppgift som färdig. Denna metod bör ansvara för att göra en PUT eller PATCH-förfrågan till vårt backend, 
  precis som create-metoden ansvarar för att göra ett POST-anrop. Metoden här ska alltså motsvara Update = PUT/PATCH. En sådan förfrågan görs med hjälp av fetch(). 

  Beroende på om ni gör frontend eller backend först i labben behöver ni på något av ställena bestämma er för en av metoderna PUT eller PATCH för denna förfrågan. 
  (Du får välja själv, läs på om vad som verkar mest vettigt för din lösning). Använder du metoden PATCH här behöver i alla fall det vara patch som tas emot i servern också, 
  app.patch(...), och vice versa om du väljer PUT. */

  /* För att utföra en förfrågan med hjälp av fetch() behöver servern veta några saker om förfrågan (request). 
  Först och främst behövs en url dit förfrågan ska skickas, sedan behövs också ett objekt med inställningar och detaljer om förfrågan, 
  detta objekt kallas vidare "{options}". Url och {options} kan sättas antingen i ett requestobjekts konstruktor; new Request(url, {options}), 
  såsom det görs i create-metoden. Eller så skulle man kunna ange allt som annars skulle ha skickats till Request-objektets konstruktor inom parenteserna hos fetch() 
  istället; fetch(url, {options})
  
  Här finns mer info om fetch-metoden: 
  https://developer.mozilla.org/en-US/docs/Web/API/fetch. */

  /* Precis som vid create behöver även här {options} innehålla egenskapen body - dvs. de data som ska skickas till server. */
  /* Det finns några sätt att utforma det som ska skickas i förfrågans body. Oavsett vad vi väljer ska det först översättas till JSON. 
  Alternativ 1: body består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
  Alternativ 2: request-objektets body består bara av förändringarna och vilken uppgift som ska förändras. Exempel: {id: 1, completed: true/false }
  Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :) */

  /***********************Labb 2 ***********************/
}
