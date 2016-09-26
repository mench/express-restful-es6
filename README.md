# Express Restful ES6

express-restful-es6 is a node.js express library which handles HTTP requests and makes much easier creating Restful APIs. 
It uses @Rest('/path') annotation put on es6 class, which indicates that annotated class is Express router.


## Installation

```sh
$ npm install --save express-restful-es6
```

## Getting Started

#### Configuration

```javascript
import express from 'express';
import restful from 'express-restful-es6';

var server = express();

restful.configure(server,{
    dirname:__dirname+'/resources'
});
```

`dirname` - Routers' Directory

folder structure example

```
-------node_modules
	|--server.js
	|--resources
		|--resource-a.js
		|--resource-b.js
		|--sub-folder
			|--resource-c.js
			|--resource-d.js
			...
```

#### Define Resource

###### Simple examples

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/')
class SimpleResource {

    get(){
        return { msg: 'hello '}
    }
}
```


With parameters

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/test/:name')
class SimpleResource {

    get(name){
        return { msg: `hello${name}`}
    }
}
```


express-restful-es6 package supports following HTTP Methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/test')
class SimpleResource {

    get(){
        console.log(this.query)
        return { msg: {
                 query : this.query
           }
        }
    }
    
    post(){
        console.info(this.body);
        return { msg: {
                body : this.body
            }
        }
    }
    put(){
            console.info(this.body);
            return { msg: {
                    body : this.body
                }
            }
    }
    delete(){}
    patch(){}
    head(){}
}
```


express-restful-es6 package also has a use() method which works like in express

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/api')
class ApiResource {
    use(){
        //authorize
        console.info("authorize");
        this.next();
    }

}


@Rest('/api/test')
class TestApiResource {
    get(){
        return {
            success:true
        }
    }
```


express-restful-es6 has @middleware annotation which adds express middleware on route methods

```javascript
import {Rest,middleware} from 'express-restful-es6';

@Rest('/api/test')
class TestApiResource {
        @middleware((req,res,next)=>{ /**...**/ next()})
        get(){
            return {
                success:true
            }
        }
```
Response can be with status code

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/api/test')
class TestApiResource {

        get(){
            return this.status(401).json({
                success:false
            })
        }
```


in express-restful-es6 express' send() and render() functions can be used like this:

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/api/send')
class TestApiResourceSend {
        get(){
            return this.send("<div>hello</div>")
        }
}
@Rest('/api/send')
class TestApiResourceRender {
        get(){
            return this.render("index")
        }
}
```


In express-restful-es6 can be Promises for handling responses like this:

```javascript
import {Rest} from 'express-restful-es6';

@Rest('/')
class HomeResource {
    async(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("hello");
            },1000)
        })
    }

    get(){
        return this.async();
    }
}
```

All sample code can be found in directory 'test'.
