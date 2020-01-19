import { environment } from 'src/environments/environment';
import { Signos } from './../_model/signos';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignoService {
  signosCambio = new Subject<Signos[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/signos`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Signos[]>(this.url);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listarPorId(idSigno: number) {
    return this.http.get<Signos>(`${this.url}/${idSigno}`);
  }

  registrar(signo: Signos) {
    return this.http.post(this.url, signo);
  }

  modificar(signo: Signos) {
    return this.http.put(this.url, signo);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/${idSigno}`);
  }
}