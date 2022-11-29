

   if(navigator.serviceWorker){
    navigator.serviceWorker.register('/sw.js').then(function(reg){
      console.log('Service Worker Registered', reg);
    });
  }

  var createDb = document.getElementById("createDb");
  var lastName = document.getElementById("lastName")
  var hours= document.getElementById("hours")

  var registrar = document.getElementById("registrar")
  var consultar = document.getElementById("consultar")

  const actualizar = document.getElementById("actualizar") 
  const eliminar = document.getElementById("eliminar")

  let db = null

  const createDatabase = () => {
    db = new PouchDB('data');  
  }
  
  const saveData = () => {

      let person = {
          _id: new Date().toISOString(),
          name:document.getElementById("name").value,
          lastname: lastName.value,
          hours: hours.value,
          sync: false
      };

      document.getElementById("name").value = ""
      lastName.value = ""
      hours.value = 0
  
     return db.put(person);
  }
  
  const getAll = () => {
      return db.allDocs({include_docs: true, descending: true});
  }
  
  const update = (person) => {
      return db.put(person);
  }
  
  const deleteP = (person) => {
      return db.remove(person);
  }
  
  createDb.addEventListener('click', createDatabase)

  registrar.addEventListener("click", (event) => {
    event.preventDefault()
    saveData()
  });
  
  consultar.addEventListener("click", () => {
    getAll().then((resultGetAll) => {
      console.log(resultGetAll.rows);
      resultGetAll.rows.map(item =>{
        console.log(`
        id: ${item.id}
        nombre: ${item.doc.name}
        apellido: ${item.doc.lastname},
        horas: ${item.doc.hours}
        sync: ${item.doc.sync}
        `);
      })
    });
  });


  actualizar.addEventListener('click', () =>{
    getAll().then(res =>{
      res.rows.map(item =>{
        item.doc.sync = true
      update(item.doc)
      })
    })

    console.log("Registros actualizados");
  })
  

  eliminar.addEventListener('click', () =>{
    getAll().then(res =>{
      res.rows.map(item =>{
        if(item.doc.sync){
          deleteP(item.doc)
        }
      })
    })


    console.log("Registros eliminados");
  })


