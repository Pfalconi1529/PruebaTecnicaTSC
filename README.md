Pasos para que funcione el app correctamente 
1.- user esta ruta http://aacdfc4a207814ac4b0cb196c25084d5-1094501816.us-east-1.elb.amazonaws.com/devOpsRouter/devOps
2.- encabezado 
  - X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c
  - Content-Type: application/json
  - X-JWT-KWY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzJmYjYwNy0zMzMxLTQ2YjQtOWZmZC05ODU2OGEwMTNmMjUiLCJpYXQiOjE3NjE4MzQwMDUxNjMsImV4cCI6MTc2MTgzNDAwODc2M30.9dYcoepxk0Xo_NzmQ6ftuLL0dQzP0KMcisuguokk18Y
3.- json para pruebas
{
"message" : "Esto es una prueba", 
"to": "Juan Perez",
"from": "Rita Asturia", 
"timeToLifeSec" : 45
}

comando para crear el jwt inicial 
node -r dotenv/config -e "import jwt from 'jsonwebtoken'; import { v4 as uuid } from 'uuid'; const secret=process.env.JWT_TRANSACTION_SECRET; const token=jwt.sign({ jti: uuid() }, secret, { expiresIn: '1h' }); console.log(token)" dotenv_config_path=./.env
