# Práctica JS/Node.js/MongoDB (Master IV 2016)
Consulta y filtrado de anuncios de compra/venta. Se necesita login para consultar.**versión**: 0.0.1


# Despliegue de la aplicación
## Instalación de depencias
~~~
npm install
~~~

La aplicación necesita de una base de datos MongoDB. La configuración de la base de datos está en `/config/default.json` en

~~~
"dbConfig": {
		"host": "localhost",
		"port": 27017,
		"dbName": "nodepop",
		"user": "macnode",
		"pwd": "d258e9c696fef4bfc713148bc3a64268"
	}
~~~

Deberás instalar MongoDB y configurar el acceso en el fichero indicado.

## Carga de Datos
~~~
npm run installDB
~~~

## Lanzar app
~~~
npm start
~~~

# Rutas
Actualmente sólo está disponible la funcionalidad de consulta, siendo necesario **autenticarse** para acceder a los datos.

## GET /apiv1/ad
Devuelve todos los anuncios del sistema con todos sus datos. En función de los parámetros se pueden filtrar, elegir los campos a mostrar, paginar y obtener el total de los anuncios de la consulta

### Parámetros[^1]

 *Parámetro* | *En* | *Descripción* | *Obligatorio* | *Schema* 
 :------ | :---------- | :----------- | :----------- | :------ 
 **nombre** | query | Nombre del producto. El literal introducido formará parte del nombre del anuncio (en cualquier parte de él)| No | string 
 **precio** | query | Precio del producto. En forma de rango. `precio=10 ➤ Precio exacto` `precio=-10 ➤ Precio ≤ 10` `precio=10- ➤ Precio ≥ 10` `precio=10-50 ➤ 10 ≤ Precio ≤ 50` | No | number 
 **tags** | query | Tags del producto, separadas por espacio `tags=lifestyle motor ➤ tags contiene LIFESTYLE and MOTOR`.| No | number 
 **esVenta** | query | Indica si el producto se vende (true) o se compra (false) `esVenta=true ➤ Anuncios de productos en venta`.| No | boolean 
 **count** | query | `count=true` devuelve el total de registros que cumplen las condiciones de búsqueda.| No | boolean 
 **limit** | query | Número máximo de registros devueltos por la consulta.| No | number 
 **skip** | query | Registros omitidos al inicio una vez realizada la consulta | No | number 
 **sort** | query | Ordena los resultados por los campos indicados aquí. Deben separarse por espacios. Si se desea que el orden sea descendente se antepondrá un guión al nombre. `sort=esVenta -precio ➤ Lista ordenada por esVenta asc y precio desc`| No | boolean 
 **fields** | query | Sólo mostrará los campos que se indiquen en este filtro. Separados por un espacio en blanco. `fields=nombre foto ➤ devolverá una lista con _id, nombre y foto`| No | boolean 
 **Accept-Language** | header | Establece el idioma de los mensajes de error. `Accept-Language: fr; q=1.0, en; q=0.5 ➤  Devuelve en francés`| No | [BCP 47](http://www.rfc-editor.org/rfc/bcp/bcp47.txt#) 
 
#### Respuesta correcta [^2]
~~~
{
	"success": true,
	"Anuncios": [
		{
			_id: "",
			nombre: "",
			descripcion: "",
			esVenta: true/false,
			precio: 0.0,
			foto: "",
			tags:
		},
		...
	] 
}
~~~
#### Respuesta incorrecta
~~~
{
	success: false,
	error: {
		name: "nombre del error",
		message: "Texto descriptivo"
	}
}

~~~

## GET /apiv1/anuncios/tags
Devuelve los distintos tags que figuran en la base de datos.

### Parámetros

Carece de parámetros

#### Respuesta correcta
~~~
{
	success: true,
	Tags: [
		"LIFESTYLE",
		"MOTOR",
		"MOBILE",
		"WORK"
	]
}
~~~

#### Respuesta incorrecta
Exactamente igual que la lista de anuncios

# Autenticación
La autenticación se realiza por medio de un JSON web token. Para obtenerlo es necesario acceder a 

## POST /apiv1/authenticate
Devuelve un token con validez para dos horas durante las que se podrá consultar la base de datos de anuncios.

 *Parámetro* | *En* | *Descripción* | *Obligatorio* | *Schema* 
 :------ | :---------- | :----------- | :----------- | :------ 
 **email** | body | Dirección de correo electrónico del usuario| Si | string (email) 
 **pass** | body | Contraseña del usuario | Si | string 
 **Accept-Language** | header | Establece el idioma de los mensajes de error. `Accept-Language: fr; q=1.0, en; q=0.5 ➤  Devuelve en francés`| No | [BCP 47](http://www.rfc-editor.org/rfc/bcp/bcp47.txt#) 
 
#### Respuesta correcta
~~~
{
  "success": true,
  "token": "..." 
}
~~~

#### Respuesta incorrecta
~~~
{
  "success": false,
  "error": {
    "name": "AuthenticationError",
    "message": "Usuario o contraseña incorrectos"
  }
}
~~~

## POST /apiv1/signup
Permite dar de alta un usuario para poder consultar los anuncios

 *Parámetro* | *En* | *Descripción* | *Obligatorio* | *Schema* 
 :------ | :---------- | :----------- | :----------- | :------ 
 **email** | body | Dirección de correo electrónico del usuario| Si | string (email) 
 **pass** | body | Contraseña del usuario | Si | string 
 **rptpass** | body | Contraseña del usuario repetida | Si | string 
 **name** | body | Nombre del usuario | No | string 
 **Accept-Language** | header | Establece el idioma de los mensajes de error. `Accept-Language: fr; q=1.0, en; q=0.5 ➤  Devuelve en francés`| No | [BCP 47](http://www.rfc-editor.org/rfc/bcp/bcp47.txt#) 
 
### Responses
#### Respuesta correcta

~~~
{
  "success": true,
  "usuario": {
    "__v": 0,
    "email": "...",
    "password": "...",
    "nombre": "...",
    "_id": "58164e1fec1fdb59a802bcd1"
  }
}
~~~

#### Respuesta incorrecta

Esta ruta valida que el correo esté bien formateado y que la pass se informe y coincida con rptpass. Dando estos tres posibles errores

* Mail del usuario obligatorio
* Formato incorrecto del mail
* Las contraseñas no coinciden
* Contraseña del usuario obligatoria 

tal  y como se muestra a continuación

~~~
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Error en validación de usuario",
    "aditionalInfo": {
      "email": {
        "message": "Formato incorrecto del mail",
        "name": "ValidatorError",
        "kind": "user defined",
        "path": "email",
        "value": "correogmail.com"
      }
    }
  }
}
~~~

# Soporte multi idioma
De forma experimental se ha añadido algo de soporte multi-idioma. En la versión actual acepta ingles (en, por defecto), español (es) y francés (fr, tomado directamente de google translate)

Para cada petición debe informarse la cabecera `Accept-Language` siguiendo la [BCP 47](https://tools.ietf.org/html/rfc7231#section-5.3.5). En esencia basta con poner la cabecera y el identificador del lenguage deseado (2 o tres letras) como valor de la cabecera.

~~~
Accept-Language: fr, en, es  ➤ Acepta por orden de preferencia francés, ingles y español. 

El resto de parámetros indican subtipos y prioridades.
~~~



Lo único que se traducen son los errores.

## Añadir un idioma

El idioma por defecto figura en la entrada `"defaultLanguage"` del fichero `./config/default.json` y los idiomas aceptados en la entrada `"userLanguages"`.

Para añadir un idioma basta con añadirlo en `"userLanguages"` e incluir las traducciones en el fichero `./config/locale.json` o el que se decida y se situe en la entrada `"langFile"`del mismo fichero `default.json`.

**./config/default.json**

~~~
	"langFile": "../../config/locale.json",     ➤     Fichero de literales traducidos
	"defaultLanguage": "es",                    ➤     Idioma por defecto
	"userLanguages": {                          ➤     Idiomas soportados
		"en": "English",
		"es": "Español",
		"fr": "Français"
	}
~~~

**./config/locale.json**

~~~
{
	"Failed to authenticate token": {
		"es": "Fallo en autenticación de token",
		"fr": "Échec de l'authentification de jeton"
	},
	...
} 

~~~

# Carga inicial
Para pruebas se ha generado un script que carga 21 anuncios y pide datos para crear el primer usuario.

Para lanzar este script basta con ejecutar la instrucción

~~~
npm run installDB
~~~

# Posibles mejoras
* Al hacer signup no mostrar la contraseña.
* Al hacer la carga inicial esconder la contraseña en la consola
* Automatizar jshint 


# Notas
[^1]: Tomado de [W3C: Encabezado Accept-Language utilizado para ubicar la configuración](https://www.w3.org/International/questions/qa-accept-lang-locales) *"El encabezado Accept-Language es información acerca de las preferencias de idioma del usuario que se envían mediante HTTP cuando se solicita un documento. Los navegadores predominantes permiten que estas preferencias de idioma sean modificadas por el usuario. El valor en sí mismo está definido por [BCP 47](http://www.rfc-editor.org/rfc/bcp/bcp47.txt#), normalmente como un código de idioma de dos o tres letras (por ejemplo: fr para francés), seguido por subcódigos opcionales que representan elementos tales como el país (por ejemplo: fr-CA representa francés tal como se habla en Canadá)".*

[^2]: El campo foto devuelve sólo el nombre del fichero con su extensión. La ruta en la que ubicarlo sera `./imagenes/anuncios/[foto]`.