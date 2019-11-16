import {Request, Response} from "express"
import * as jwt from "jsonwebtoken"
import {apiConfig} from './api-config'

export const handleAuthorization = (req: Request, resp: Response, next) => {
  const token = extractToken(req)
  if(!token){
    resp.setHeader('WWW-Authenticate', 'Bearer token_type="JWT"')
    resp.status(401).json({message: 'Voce precisa se autenticar.'})
  }else{
    //verify o token e decodifica se estiver certo, passa o token, o password pra verificar o token e a callback
    //que é uma function pra verificar se deu tudo certo!
    jwt.verify(token, apiConfig.secret, (error, decoded) =>{
      if(decoded){
        next()
      }else{
        resp.status(403).json({message: 'Nao autorizado.'})
      }
    })
  }

}

function extractToken(req: Request): string {
  let token = undefined
  if(req.headers && req.headers.authorization){
    const parts: string[] = (req.headers.authorization as string).split(' ');
    if(parts.length === 2 && parts[0] === 'Bearer'){
      token = parts[1]
    }
  }
  return token
}
