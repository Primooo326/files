import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { PoderesService } from 'src/app/services/poderes.service';

@Component({
  selector: 'app-poderes2',
  templateUrl: './poderes2.component.html',
  styleUrls: ['./poderes2.component.css'],
})
export class Poderes2Component implements OnInit {
  botonDisabled: boolean = false;
  botonHidden: boolean = false;

  agregandoAsamblea = false;

  mensaje = '';

  asamblea = `Simulacro2`;

  formulario: FormGroup;
  nuevaAsamblea: FormGroup;

  asambleaList$: Observable<any>;
  collectionAsambleas: AngularFirestoreCollection<any>;

  inmueblePoder$: Observable<any>;
  collectionPoder: AngularFirestoreCollection<any>;
  inmueblePoderPath = 'Simulacro2';
  inmueblePoderData: any;
  inmueblePoderConPoderes$: Observable<any> | undefined;

  inmuebleApoderado$: Observable<any>;
  collectionApoderado: AngularFirestoreCollection<any>;
  inmuebleApoderadoPath = 'Simulacro2';
  inmuebleApoderadoData: any;
  inmueblesApoderados$: Observable<any> | undefined;

  inmuebles$: Observable<any>;
  collectionInmuebles: AngularFirestoreCollection<any>;

  paths = {
    poderes: `${this.asamblea}/Inmueble/Lista`,
    lista: `${this.asamblea}/Inmueble/Lista`,
  };

  constructor(
    private _poderes: PoderesService,
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.collectionAsambleas = this._firestore.collection<any>(
      `consultarAsambleaTest`
    );
    this.asambleaList$ = this.collectionAsambleas.valueChanges();

    this.collectionPoder = this._firestore.collection<any>(
      `${this.inmueblePoderPath}`
    );
    this.inmueblePoder$ = this.collectionPoder.valueChanges();

    this.collectionApoderado = this._firestore.collection<any>(
      `${this.inmuebleApoderadoPath}`
    );
    this.inmuebleApoderado$ = this.collectionApoderado.valueChanges();

    this.collectionInmuebles = this._firestore.collection<any>(
      `Simulacro2/Inmueble/Lista`
    );
    this.inmuebles$ = this.collectionInmuebles.valueChanges();

    this.formulario = this.formBuilder.group({
      Apoderado: ['', Validators.required],
      Poder: ['', Validators.required],
    });
    this.nuevaAsamblea = this.formBuilder.group({
      AsambleaNombre: ['', Validators.required],
    });
  }

  ngOnInit() {}

  activaAgregarAsamblea() {
    if (this.agregandoAsamblea === false) {
      this.agregandoAsamblea = true;
    } else {
      this.agregandoAsamblea = false;
    }
  }

  agregarAsamblea() {
    const asamblea = this.nuevaAsamblea.get('AsambleaNombre')!.value;

    const asambleaCollection = this._firestore.collection(
      'consultarAsambleaTest'
    );
    asambleaCollection
      .doc(`${asamblea}`)
      .set({ asambleaActiva: true, asambleaId: asamblea })
      .then(() => {});
    this.activaAgregarAsamblea();
  }

  selectAsamblea(a: string) {
    this.asamblea = a;
  }

  traerInmuebleApoderado() {
    const inmueble = this.formulario.get('Apoderado')!.value;

    this.inmuebleApoderadoPath = `${this.asamblea}/Inmueble/Lista`;

    this.collectionApoderado = this._firestore.collection<any>(
      `${this.inmuebleApoderadoPath}`
    );
    this.inmuebleApoderado$ = this.collectionApoderado.valueChanges();

    this.inmuebleApoderado$.subscribe((resp) => {
      resp.forEach((inmuebleData: any) => {
        if (inmuebleData.codigo == inmueble) {
          console.log(inmuebleData);
          this.inmuebleApoderadoData = inmuebleData;
        }
      });
      const inmuebles = this._firestore.collection(
        `${this.asamblea}/Inmueble/Lista/${this.inmuebleApoderadoData.codigo}/Poderes`
      );
      this.inmueblesApoderados$ = inmuebles.valueChanges();
      this.inmueblesApoderados$.subscribe((resp: any) => {
        console.log(resp);
      });
    });
    this.traerInmueblePoder();
  }

  traerInmueblePoder() {
    if (this.formulario.get('Poder')!.value.length > 0) {
      const inmueble = this.formulario.get('Poder')!.value;

      this.inmueblePoderPath = `${this.asamblea}/Inmueble/Lista`;

      this.collectionPoder = this._firestore.collection<any>(
        `${this.inmueblePoderPath}`
      );
      this.inmueblePoder$ = this.collectionPoder.valueChanges();

      this.inmueblePoder$.subscribe((resp) => {
        resp.forEach((inmuebleData: any) => {
          if (inmuebleData.codigo == inmueble) {
            console.log(inmuebleData);
            this.inmueblePoderData = inmuebleData;
          }
        });
        this.validator();
      });
    } else {
      console.log('no hay poder, digite uno');
      this.inmueblePoderData = null;
    }
  }

  setInmuebleApoderado(i: any) {
    console.log(i);
    this.inmueblePoderPath = `${this.asamblea}/Inmueble/Lista`;

    this.collectionPoder = this._firestore.collection<any>(
      `${this.inmueblePoderPath}`
    );
    this.inmueblePoder$ = this.collectionPoder.valueChanges();

    this.inmueblePoder$.subscribe((resp) => {
      resp.forEach((inmuebleData: any) => {
        if (inmuebleData.codigo == i) {
          console.log(inmuebleData);
          this.inmueblePoderData = inmuebleData;
        }
      });
      this.validator();
    });
  }

  validator() {
    const inmuebleApoderado = this.formulario.get('Apoderado')!.value;
    let inmuebleApoderadoPoderes: any[] = [];

    const inmueblePoder = this.inmueblePoderData.codigo;

    console.log(inmueblePoder);
    console.log(inmuebleApoderado);

    //todo si el apoderado incluye el poder

    const inmuebles = this._firestore.collection(
      `${this.asamblea}/Inmueble/Lista/${inmuebleApoderado}/Poderes`
    );

    this.inmueblesApoderados$ = inmuebles.valueChanges();
    this.inmueblesApoderados$.subscribe((resp: any) => {
      resp.forEach((element: any) => {
        inmuebleApoderadoPoderes.push(element.codigo);
      });
      console.log(inmuebleApoderadoPoderes);
      if (inmuebleApoderadoPoderes.includes(inmueblePoder)) {
        this.botonHidden = true;
      } else {
        this.botonHidden = false;
      }
    });

    if (inmuebleApoderado == inmueblePoder) {
      this.botonDisabled = true;
    } else {
      this.botonDisabled = false;

      if (this.inmueblePoderData.estado == '3') {
        this.botonDisabled = true;
      } else {
        this.botonDisabled = false;

        if (this.inmuebleApoderadoData.estado == '3') {
          this.botonDisabled = true;
        } else {
          this.botonDisabled = false;
        }
      }
    }

    //todo si apoderado es igual al poder, si el poder es estado 3,
  }

  agregarPoder() {
    let coeficienteTotal = 0;
    let totalCoeficiente = 0;
    let totalCoeficienteVoto = 0;
    let coeficienteVoto = 0;

    const inmuebleApoderado = this.formulario.get('Apoderado')!.value;
    const inmueblePoder = this.inmueblePoderData.codigo;

    //todo    agregar el poder al apoderado

    const collectionApoderado = this._firestore.collection(
      `${this.asamblea}/Inmueble/Lista/${inmuebleApoderado}/Poderes`
    );
    collectionApoderado.doc(inmueblePoder).set({
      codigo: this.inmueblePoderData.codigo,
      coeficiente: this.inmueblePoderData.coeficiente,
      puedeVotar: true,
      propietario: this.inmueblePoderData.propietario,
    });

    //todo     recoger valores de coeficientes
    const collectionInmuebles = this._firestore.collection(
      `${this.asamblea}/Inmueble/Lista`
    );

    const valoresApoderado = collectionInmuebles.doc(inmuebleApoderado).get();
    valoresApoderado.subscribe((resp: any) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = coeficienteTotal + resp.data().coeficiente;
      coeficienteVoto = coeficienteVoto + resp.data().coeficienteVoto;
      totalCoeficiente = resp.data().totalCoeficiente + 1;
      totalCoeficienteVoto = resp.data().totalCoeficienteVoto + 1;
    });

    const valoresPoder = collectionInmuebles.doc(inmueblePoder).get();
    valoresPoder.subscribe((resp: any) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = coeficienteTotal + resp.data().coeficiente;
      coeficienteVoto = coeficienteVoto + resp.data().coeficienteVoto;

      //todo     update inmueble apoderado y poder

      this.collectionInmuebles.doc(`${inmuebleApoderado}`).update({
        coeficiente: coeficienteTotal,
        coeficienteVoto: coeficienteVoto,
        totalCoeficiente: totalCoeficiente,
        totalCoeficienteVoto: totalCoeficienteVoto,
      });
      this.collectionInmuebles
        .doc(`${inmueblePoder}`)
        .update({
          estado: '3',
        })
        .then(() => {
          this.traerInmueblePoder();
        });
    });
  }

  eliminarPoder() {
    let coeficienteTotal = 0;
    let totalCoeficiente = 0;
    let totalCoeficienteVoto = 0;
    let coeficienteVoto = 0;

    const inmuebleApoderado = this.formulario.get('Apoderado')!.value;
    const inmueblePoder = this.inmueblePoderData.codigo;

    //todo    agregar el poder al apoderado

    const collectionApoderado = this._firestore.collection(
      `${this.asamblea}/Inmueble/Lista/${inmuebleApoderado}/Poderes`
    );
    collectionApoderado.doc(inmueblePoder).delete();

    //todo     recoger valores de coeficientes
    const collectionInmuebles = this._firestore.collection(
      `${this.asamblea}/Inmueble/Lista`
    );

    const valoresApoderado = collectionInmuebles.doc(inmuebleApoderado).get();
    valoresApoderado.subscribe((resp: any) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = resp.data().coeficiente;
      coeficienteVoto = resp.data().coeficienteVoto;
      totalCoeficiente = resp.data().totalCoeficiente - 1;
      totalCoeficienteVoto = resp.data().totalCoeficienteVoto - 1;
    });

    const valoresPoder = collectionInmuebles.doc(inmueblePoder).get();
    valoresPoder.subscribe((resp: any) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = coeficienteTotal - resp.data().coeficiente;
      coeficienteVoto = coeficienteVoto - resp.data().coeficienteVoto;

      //todo     update inmueble apoderado y poder

      this.collectionInmuebles.doc(`${inmuebleApoderado}`).update({
        coeficiente: coeficienteTotal,
        coeficienteVoto: coeficienteVoto,
        totalCoeficiente: totalCoeficiente,
        totalCoeficienteVoto: totalCoeficienteVoto,
      });
      this.collectionInmuebles
        .doc(`${inmueblePoder}`)
        .update({
          estado: '1',
        })
        .then(() => {
          this.traerInmueblePoder();
        });
    });
  }
}
