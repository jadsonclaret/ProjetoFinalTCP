  var db = null;
  const DB_NAME = 'mdn-demo-indexeddb-enoticias4';
  const DB_VERSION = 1; 
  const DB_STORE_NAME = 'noticias4';
 
  var current_view_pub_key; 

var functions = {  

  openDb: function() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) { 
      db = this.result;
      console.log("openDb DONE");
      functions.displayPubList();
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

      store.createIndex('id', 'id', { unique: true});
      store.createIndex('description', 'description', { unique: false });
      store.createIndex('value', 'value', { unique: false });
    };
  },


  /**
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  getObjectStore: function(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  },

  /**
   * @param {IDBObjectStore=} store
   */
  displayPubList: function(store) {
    console.log("displayPubList");

    if (typeof store == 'undefined')
      store = functions.getObjectStore(DB_STORE_NAME, 'readonly');

    var pub_list; //= $('#pub-list');
  
    var req;
    req = store.count();
    
    req.onsuccess = function(evt) {
      /*alert('Possui'  + evt.target.result +
                     ' cadastros armazenados.);*/
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      alert('Erro ao verificar quantidade de dados armazenados no banco.');
    };

    var i = 0;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;

     if (cursor) {
        console.log("displayPubList cursor:", cursor);
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
        };
        listar.carregarValoresParaLista(cursor.value.id, cursor.value.description, cursor.value.value);
        cursor.continue();

       
        i++;
      } else {
        console.log("No more entries");
      }//
    };
  },

  /**
   * @param {string} id*/
  
    deletePublicationFromById: function(idDelete) {
    idDelete = Number(idDelete);
    console.log("deletePublication:", arguments);
    var store = functions.getObjectStore(DB_STORE_NAME, 'readwrite');
    functions.deletePublication(idDelete, store);
  },

  genID: function(list){
    var novoId = 0;
        
    list.forEach(function(idLista) {
      if (idLista.id >= novoId){
        novoId = idLista.id + 1;
      }
    });
    return novoId;    
  },


  deletePublication: function(key, store) {
    console.log("deletePublication:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readwrite');

   
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record == 'undefined') {
        displayActionFailure("NÃ£o foi encontrado na base de dados");
        return;
      }
     
      req = store.delete(key);
      req.onsuccess = function(evt) {
        console.log("evt:", evt);
        console.log("evt.target:", evt.target);
        console.log("evt.target.result:", evt.target.result);
        console.log("delete successful");
      };
      req.onerror = function (evt) {
        console.error("deletePublication:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("deletePublication:", evt.target.errorCode);
      };
  },  

  //Limpa todos os registro do banco (nÃ£o esta sendo utilizado)
  clearObjectStore: function(store_name) {
    var store = functions.getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
    };
  },  

  addPublication: function(id, description, value) {
      console.log("addPublication arguments:", arguments);
      var obj = { id: id, description: description, value: value };

      var store = functions.getObjectStore(DB_STORE_NAME, 'readwrite');
      var req;
      try {
        req = store.add(obj);
      } catch (e) {
        if (e.name == 'DataCloneError')
          displayActionFailure("This engine doesn't know how to clone a Blob, " +
                               "use Firefox");
        throw e;
      }
      req.onsuccess = function (evt) {
        console.log("Insertion in DB successful");
        //displayActionSuccess();
        //displayPubList(store);
      };
      req.onerror = function() {
        console.error("addPublication error", this.error);
        //displayActionFailure(this.error);
      };
  }

};
  functions.openDb();