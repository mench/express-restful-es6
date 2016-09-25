import { Router } from 'express';
import http from 'http';

const methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'head',
    'use'
];

export const routers = [];

class ResponseWrapper{
    constructor(res){
        this.res = res;
    }

    status(){
        this.res.status.apply(this.res,arguments);
        return this;
    }

    render(){
        return Promise.resolve(this.res.render.apply(this.res,arguments));
    }

    json(){
        return Promise.resolve(this.res.json.apply(this.res,arguments));
    }

    send(){
        return Promise.resolve(this.res.send.apply(this.res,arguments));
    }
}

class Handler {

    constructor(Class){
        this.resource = new Class();
    }

    handle(req,res,next,action){
        var response = new ResponseWrapper(res);
        Object.defineProperties(this.resource,{
            headers     : {value:req.headers,configurable: true},
            query       : {value:req.query,configurable: true},
            params      : {value:req.params,configurable: true},
            path        : {value:req.path,configurable: true},
            body        : {value:req.body,configurable: true},
            response    : {value:res,configurable: true},
            request     : {value:req,configurable: true},
            next        : {value:next,configurable: true},
            json:{value:response.json.bind(response),configurable: true},
            send:{value:response.send.bind(response),configurable: true},
            status:{value:response.status.bind(response),configurable: true},
            render:{value:response.render.bind(response),configurable: true}
        });
        var args = Object.keys(this.resource.params).map(k=>this.resource.params[k]);
        args.push(req);
        args.push(res);
        args.push(next);
        var resource = this.resource;
        var promise = new Promise((resolve,reject)=>{
            try{
                resolve(resource[action].apply(resource,args));
            }catch(e){
                reject(e);
            }

        });
        promise.then(result=>{
            if(result instanceof http.ServerResponse){
                return;
            }
            if(result instanceof Error){
                res.status(result.code || 500).json(result);
            }else
            if(typeof result != 'undefined' && result != null){
                res.json(result);
            }else
            if(result == null && typeof result == 'object'){
                res.status(404).json({
                    code:404,
                    message:'resource not found'
                });
            }
        }).catch(err=>{
            console.info(err);
            try {
                if(err instanceof Error){
                    return res.status(err.code || 500).json({
                        error   : err.message,
                        errors   : err.errors,
                        code    : err.code || 500,
                        stack   : err.stack.split("\n")
                    });
                }
                res.status(500).send(err);
            }catch (e){
                console.error(e);
                res.status(500).send(e);
            }
        })

    }

}

export function Rest(url){
    return (Class,key,descriptor)=>{
        if(typeof Class != 'function'){
            throw new Error('must be class not a prop..')
        }
        var router   = Router();
        var handler  = new Handler(Class);
        methods.forEach((action)=>{
            if( handler.resource[action] instanceof Function ){
                router[action](url,(req,res,next)=>{
                    handler.handle(req,res,next,action);
                });
            }
        });
        routers.push(router);
    }
}