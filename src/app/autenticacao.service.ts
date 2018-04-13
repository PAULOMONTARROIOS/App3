import { Usuario } from './acesso/usuario.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/Router';

@Injectable()
export class Autenticacao {

    public token_id: string = ""
    constructor(private router: Router) { }

    public cadastrarUsuario(usuario: Usuario): Promise<any> {
        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
                delete usuario.senha

                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set(usuario);

            }).catch((error: any) => {
                console.log(error);
            })
    }

    public autenticar(email: string, senha: string): void {
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => {
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken',idToken)
                        this.router.navigate(['/home'])
                    })
            })
            .catch((erro: Error) => {
                console.log(erro)
            });
    }

    public autenticado(): boolean {
        if(this.token_id === undefined && localStorage.getItem('idToken') != null ){
            this.token_id = localStorage.getItem('idToken')   
        }
        if(localStorage.getItem('idToken') == null){
            this.router.navigate(['/'])
        }
        return localStorage.getItem('idToken') != null
    }

    public sair(): void{
        firebase.auth().signOut()
            .then(()=>{
                localStorage.removeItem('idToken');
                this.token_id = undefined;
                this.router.navigate(['/']);
            })
            .catch((err: any)=>{
                console.log("Ocorreu um erro ao deslogar. :(");
            })
    }
}