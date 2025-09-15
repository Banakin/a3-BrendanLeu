const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = {
  99: {
    "my_ship_name": "Earth Test Ship",
    "my_ship_id": "EA_001",
    "opposing_ship_name": "Mars Test Ship",
    "opposing_ship_id": "MR_001",
    "start": "2086-12-30T04:51:00.000Z",
    "end": "2087-02-02T06:03:00.000Z",
    "minute_length": 49032,
    "damage_report": "Left wing in critical condition."
  }
}

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  } else if ( request.method === "POST" ){
    handlePost( request, response ) 
  } else if( request.method === "DELETE" ){
    handleDelete( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if ( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  } else if (request.url === "/api/data") {
    response.writeHeader( 200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  } else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
    dataString += data 
  })

  request.on( "end", function() {
    const params = new URLSearchParams(dataString);

    dataObj = Object.fromEntries(params);

    // console.log(
    //   {
    //     start: `new Date(${dataObj.start_year}, ${dataObj.start_month}, ${dataObj.start_day}, ${dataObj.start_hour}, ${dataObj.start_minute});`,
    //     end: `new Date(${dataObj.end_year}, ${dataObj.end_month}, ${dataObj.end_day}, ${dataObj.end_hour}, ${dataObj.end_minute});`,
    //     start_obj: new Date(parseInt(dataObj.start_year), dataObj.start_month, dataObj.start_day, dataObj.start_hour, dataObj.start_minute).toLocaleString("en-US"),
    //     end_obj: new Date(parseInt(dataObj.end_year), dataObj.end_month, dataObj.end_day, dataObj.end_hour, dataObj.end_minute)
    //   }
    // )
    
    // Make new object
    storageObj= new Object();
    storageObj.my_ship_name = dataObj.my_ship_name;
    storageObj.my_ship_id = dataObj.my_ship_id;
    storageObj.opposing_ship_name = dataObj.opposing_ship_name;
    storageObj.opposing_ship_id = dataObj.opposing_ship_id;
    storageObj.start = new Date(dataObj.start_year, dataObj.start_month, dataObj.start_day, dataObj.start_hour, dataObj.start_minute);
    storageObj.end = new Date(dataObj.end_year, dataObj.end_month, dataObj.end_day, dataObj.end_hour, dataObj.end_minute);
    storageObj.minute_length = (storageObj.end.getTime() - storageObj.start.getTime()) / (1000 * 60); // In minutes
    storageObj.damage_report = dataObj.damage_report;

    if (dataObj.battle_id == "" || !dataObj.battle_id) {
      dataObj.battle_id = Math.floor(Math.random() * 9999)
    }

    appdata[dataObj.battle_id] = storageObj;

    sendFile( response, "public/index.html" ); // Render homepage again
  })
}

const handleDelete = function( request, response ) {
  if (request.url.startsWith('/api/data/') && request.url.length > 10) {
    index = request.url.substring(10)
    
    object = appdata[index]
    delete appdata[index]

    response.writeHeader( 200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(object))
  } else {
    response.writeHeader( 404 )
    response.end( "404 Error: Endpoint" )
  }
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

console.log(`Server is hosted at http://localhost:${process.env.PORT || port}`)
server.listen( process.env.PORT || port )
