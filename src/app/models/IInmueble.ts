export interface IInmueble {
  activaCamara: boolean; // Se le permite particiopar directo
  apto: string;
  codigo: string;
  coeficiente: number; // coeficiente total sumado a los poderes y el de su apartamento
  coeficienteVoto?: number; // coeficiente permitido de voto en caso de que aplique normalmente no deudores
  coeficientePropio?: number; // coeficiente de su apartamento
  cedePoder?: boolean; // es o no poderdante
  hasPower?: boolean; // deterimna si tiene poderes a cargo
  //asistentes:number;
  documento: string; // Documento de identificacion del propietario
  profile?: string; // {SUPER_USER, MANAGER, PARTICIPANT, GUEST}
  propietario: string; //
  puedeVotar?: boolean; //
  reenvio?: string; // bandera de reenvios de correo - posiblemente grupo
  token?: string; // el usuario se logea con token asignado
  tknGen?: string; // token preasignado asignado
  torre: string;
  totalCoeficiente: string; // Numero de inmuebles representados + los de los poderes.
  totalCoeficienteVoto?: string; // Numero de inmuebles representados que pueden votar.
  estado: string; // Activo, no activo
  email?: string;
}

export class Inmueble implements IInmueble {
  activaCamara = true;
  apto = "202";
  codigo = "09202";
  coeficiente = 1;
  coeficienteVoto? = 1;
  coeficientePropio? = 1;
  cedePoder? = true;
  hasPower? = true;
  documento = "1001092278";
  profile? = "GUESS";
  propietario = "no";
  puedeVotar? = true;
  reenvio? = "no";
  token? = "456123";
  tknGen? = "456123";
  torre = "09";
  totalCoeficiente = "1";
  totalCoeficienteVoto? = "1";
  estado = "1";
  email? = "juanskate326@gmail.com";
}
