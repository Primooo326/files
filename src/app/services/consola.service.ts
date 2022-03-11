import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConsolaService {
  private backend = environment.backend;

  response: any;

  constructor(private http: HttpClient) {}

  private async metodos(servicio: string, params: any) {
    const method = this.backend + servicio;

    console.log('method::', params);

    console.log(method);
    const sendResp = this.http.post(method, params, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json)' }),
    });
    return sendResp.pipe(
      map((resp) => {
        console.log(resp);
      })
    );
  }
  async getAsambleas() {
    const sendResp = { asambleaId: 'Simulacro2' };
    const aver = await this.metodos(
      'consola-getAsambleasList',
      JSON.stringify(sendResp)
    );
    this.response = await firstValueFrom(aver);
  }
  async setAsambleas() {}
  async selectCollection() {}
  async selectDocument() {}
}
