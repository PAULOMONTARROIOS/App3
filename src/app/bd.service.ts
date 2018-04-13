import { Progresso } from './progresso.service';
import * as firebase from 'firebase'
import { Injectable } from '@angular/core';

@Injectable()
export class Bd {

    constructor(private progresso: Progresso) {
    }

    public publicar(publicacao: any): void {

        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
            .push({ titulo: publicacao.titulo })
            .then((resposta: any) => {
                let nomeImagem = resposta.key

                firebase.storage().ref()
                    .child(`imagens/${nomeImagem}`)
                    .put(publicacao.imagem)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot: any) => {
                        this.progresso.status = "Andamento"
                        this.progresso.estado = snapshot
                    },
                    (erro: any) => {
                        this.progresso.status = "Erro"
                    },
                    () => {
                        this.progresso.status = "Concluído"
                    }
                    )
            })
    }

    public consultaPublicoes(emailUsuario: string): Promise<any> {

        return new Promise((resolve, reject) => {
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
                .orderByKey()
                .once('value')
                .then((snapshot: any) => {
                    console.log(snapshot.val())

                    let publicacoes: Array<any> = []

                    snapshot.forEach((childSnapshot: any) => {
                        let publicacao = childSnapshot.val()
                        publicacao.key = childSnapshot.key

                        publicacoes.push(publicacao)
                    });
                    return publicacoes.reverse();
                }).then((publicacoes: any) => {
                    console.log('teste: ', publicacoes)

                    publicacoes.forEach(publicacao => {
                        firebase.storage().ref()
                            .child(`imagens/${publicacao.key}`)
                            .getDownloadURL()
                            .then((url: string) => {
                                publicacao.url_imagem = url;
                                firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                    .once('value')
                                    .then((snapshot: any) => {
                                        publicacao.nome_usuario = snapshot.val().nome_usuario
                                    })
                            })
                    });
                    resolve(publicacoes)
                })
        })
    }
}
