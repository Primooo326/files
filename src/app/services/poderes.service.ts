import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PoderesService {
  private backend = 'environment.backend;';

  response: any;

  constructor(private http: HttpClient) {}

  private async metodos(servicio: string, params: any) {
    const method = this.backend + servicio;

    console.log('method::', params);

    // console.log(method);
    return this.http.post(method, params, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json)' }),
    });
  }
  async getAsambleas() {
    const sendResp = { asambleaId: 'Simulacro2' };
    const metodo = await this.metodos(
      'consola-getAsambleasList',
      JSON.stringify(sendResp)
    );
    return (this.response = await firstValueFrom(metodo));
  }
  async setAsambleas(i: string) {
    const sendResp = { asambleaId: i, asambleaActiva: true };
    const metodo = await this.metodos(
      'consola-setAsamblea',
      JSON.stringify(sendResp)
    );
    return (this.response = await firstValueFrom(metodo));
  }
  // async getInmueble(path: string) {
  //   let inmbuele$: Observable<IInmueble[]>;
  //   let collectionRef = this._firestore.collection<IInmueble>(path);
  //   inmbuele$ = collectionRef.valueChanges();
  //   return inmbuele$;
  // }
}
