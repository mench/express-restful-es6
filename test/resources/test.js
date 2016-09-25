import {Rest} from '../../index';

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

    get(){
        return {
            success:true
        }
    }

}