import {Rest,middleware} from '../../index';

@Rest('/')
class HomeResource {

    async(){
        return new Promise(function(resolve,reject){
            setTimeout(()=>{
                resolve("hello");
            })
        })
    }

    get(){
        return this.async();
    }
}

@Rest('/v1')
class ApiResource {

    use(){
        //authorize
        console.info("authorize");
        this.next();
    }

}


@Rest('/v1/test')
class TestApiResource {

    post(){

    }

    @middleware((req,res,next)=>{
        console.info("middle2")
        next()
    })
    @middleware(function(req,res,next){
        console.info("middle1",this);
        next();
    })
    get(){
        return this.send("<div>hello</div>")
    }

}