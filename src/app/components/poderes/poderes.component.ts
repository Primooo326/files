import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { IInmueble } from 'src/app/models/IInmueble';
import { PoderesService } from '../../services/poderes.service';

@Component({
  selector: 'app-poderes',
  templateUrl: './poderes.component.html',
  styleUrls: ['./poderes.component.css'],
})
export class PoderesComponent implements OnInit {
  asambleas: any[] = [];
  asambleaSeleccionada: string = 'Selecione una asamblea';
  formulario: FormGroup;
  path: string = 'Selecione una asamblea';

  hayInmueblePoder = false;

  inmuebleData: any;
  inmuebleApoderado: any;
  inmueblePoder: any;
  inmueblesApoderados: any[] = [];

  buttonDisabled = false;

  inmueble$: Observable<IInmueble[]>;
  collectionRef: AngularFirestoreCollection<any>;

  inmueblePoder$: Observable<any>;
  collectionPoderRef: AngularFirestoreCollection<any>;

  inmuebleApoderado$: Observable<any>;
  collectionApoderPoderadoRef: AngularFirestoreCollection<any>;

  constructor(
    private _poderes: PoderesService,
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.collectionRef = this._firestore.collection<any>(
      `${this.asambleaSeleccionada}`
    );
    this.inmueble$ = this.collectionRef.valueChanges();

    this.collectionPoderRef = this._firestore.collection<any>(`${this.path}`);
    this.inmueblePoder$ = this.collectionRef.valueChanges();

    this.collectionApoderPoderadoRef = this._firestore.collection<any>(
      `${this.path}`
    );
    this.inmuebleApoderado$ = this.collectionRef.valueChanges();

    this.formulario = this.formBuilder.group({
      Apoderado: ['', Validators.required],
      Poder: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.traerAsambleas();
  }

  traerAsambleas() {
    this._poderes.getAsambleas().then((resp: any) => {
      // console.log(resp.data);
      for (let i = 0; i < resp.data.length; i++) {
        if (this.asambleas.includes(resp.data[i].asambleaId)) {
          console.log('si incluye');
        } else {
          console.log('no incluye');
          this.asambleas.push(resp.data[i].asambleaId);
        }
      }
    });
  }

  selectAsamblea(a: string) {
    this.asambleaSeleccionada = a;
  }

  traerInmuebleApoderado() {
    const inmueble = this.formulario.get('Apoderado')!.value;
    console.log(inmueble);
    this.path = `${this.asambleaSeleccionada}/Inmueble/Lista/${inmueble}/Poderes`;
    this.collectionRef = this._firestore.collection<any>(`${this.path}`);
    this.inmueble$ = this.collectionRef.valueChanges();
    this.inmueble$.forEach((resp: any) => {
      resp.forEach((resp2: any) => {
        console.log(resp2);
        this.inmueblesApoderados.push(resp2.codigo);
      });
    });
    this.inmueblePoder = inmueble;

    this.collectionApoderPoderadoRef = this._firestore.collection<any>(
      `${this.asambleaSeleccionada}/Inmueble/Lista`
    );
    this.inmuebleApoderado$ = this.collectionApoderPoderadoRef.valueChanges();
    this.inmuebleApoderado$.subscribe((resp) => {
      resp.forEach((inmuebleRef: any) => {
        if (inmuebleRef.codigo == inmueble) {
          console.log(inmuebleRef);
          this.inmuebleApoderado = inmuebleRef;
        }
      });
    });
  }

  async traerInmueblePoder() {
    const inmueble = this.formulario.get('Poder')!.value;
    console.log(inmueble);
    this.path = `${this.asambleaSeleccionada}/Inmueble/Lista`;
    this.collectionPoderRef = this._firestore.collection<any>(`${this.path}`);
    this.inmueblePoder$ = this.collectionPoderRef.valueChanges();
    this.inmueblePoder$.subscribe((resp) => {
      resp.forEach((inmuebleRef: any) => {
        if (inmuebleRef.codigo == inmueble) {
          console.log(inmuebleRef);
          this.inmuebleData = inmuebleRef;
          this.hayInmueblePoder = true;
        }
      });
    });
    setTimeout(() => {
      if (
        this.inmueblesApoderados.includes(inmueble) ||
        this.inmuebleApoderado.codigo == inmueble
      ) {
        this.buttonDisabled = true;
        console.log(
          this.inmueblesApoderados,
          this.inmuebleApoderado.codigo,
          inmueble
        );
      } else {
        this.buttonDisabled = false;
      }
    }, 500);
  }

  async agregarPoder() {
    console.log(this.inmuebleData);
    console.log(this.inmueblePoder);

    this.path = `${this.asambleaSeleccionada}/Inmueble/Lista/${this.inmueblePoder}/Poderes`;
    this.collectionRef = this._firestore.collection<any>(`${this.path}`);
    this.collectionRef.doc(`${this.inmuebleData.codigo}`).set({
      codigo: this.inmuebleData.codigo,
      coeficiente: this.inmuebleData.coeficiente,
      puedeVotar: true,
      propietario: this.inmuebleData.propietario,
    });

    this.collectionRef = this._firestore.collection<any>(
      `${this.asambleaSeleccionada}/Inmueble/Lista/`
    );

    let coeficienteTotal = 0;
    let totalCoeficiente = 0;
    let totalCoeficienteVoto = 0;
    let coeficienteVoto = 0;
    const coeficientePoder = this.collectionRef
      .doc(`${this.inmueblePoder}`)
      .get();

    const coeficienteApoderado = this.collectionRef
      .doc(`${this.inmuebleData.codigo}`)
      .get();

    coeficientePoder.subscribe((resp) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = coeficienteTotal + resp.data().coeficiente;
      coeficienteVoto = coeficienteVoto + resp.data().coeficienteVoto;
      totalCoeficiente = resp.data().totalCoeficiente + 1;
      totalCoeficienteVoto = resp.data().totalCoeficienteVoto + 1;
    });

    coeficienteApoderado.subscribe(async (resp) => {
      console.log(resp.data().coeficiente);
      coeficienteVoto = coeficienteVoto + resp.data().coeficienteVoto;
      coeficienteTotal = coeficienteTotal + resp.data().coeficiente;
      console.log(coeficienteTotal);

      console.log(totalCoeficienteVoto);
      console.log(totalCoeficiente);

      this.collectionRef
        .doc(`${this.inmuebleData.codigo}`)
        .update({ estado: '3' });
      this.collectionRef
        .doc(`${this.inmueblePoder}`)
        .update({
          coeficiente: coeficienteTotal,
          coeficienteVoto: coeficienteVoto,
          totalCoeficiente: totalCoeficiente,
          CoeficienteVoto: totalCoeficienteVoto,
        })
        .then(() => {
          this.traerInmueblePoder();
        });
    });
  }

  eliminarPoder() {
    console.log(this.inmuebleData);
    console.log(this.inmueblePoder);

    this.collectionRef = this._firestore.collection<any>(
      `${this.asambleaSeleccionada}/Inmueble/Lista/`
    );

    let coeficienteTotal = 0;
    let totalCoeficiente = 0;
    let totalCoeficienteVoto = 0;
    let coeficienteVoto = 0;

    const coeficientePoder = this.collectionRef
      .doc(`${this.inmueblePoder}`)
      .get();

    const coeficienteApoderado = this.collectionRef
      .doc(`${this.inmuebleData.codigo}`)
      .get();

    coeficientePoder.subscribe((resp) => {
      console.log(resp.data().coeficiente);
      coeficienteTotal = resp.data().coeficiente;
      coeficienteVoto = resp.data().coeficienteVoto;
      totalCoeficiente = resp.data().totalCoeficiente - 1;
      totalCoeficienteVoto = resp.data().totalCoeficienteVoto - 1;
      console.log(resp.data().coeficiente - coeficienteTotal);
    });

    coeficienteApoderado.subscribe(async (resp) => {
      console.log(resp.data().coeficiente);
      coeficienteVoto = coeficienteVoto - resp.data().coeficienteVoto;
      coeficienteTotal = coeficienteTotal - resp.data().coeficiente;
      console.log(coeficienteTotal);

      console.log(totalCoeficienteVoto);

      console.log(totalCoeficiente);

      this.collectionRef
        .doc(`${this.inmuebleData.codigo}`)
        .update({ estado: '1' });
      this.collectionRef.doc(`${this.inmueblePoder}`).update({
        coeficiente: coeficienteTotal,
        coeficienteVoto: coeficienteVoto,
        totalCoeficiente: totalCoeficiente,
        totalCoeficienteVoto: totalCoeficienteVoto,
      });
      this.path = `${this.asambleaSeleccionada}/Inmueble/Lista/${this.inmueblePoder}/Poderes`;
      this.collectionRef = this._firestore.collection<any>(`${this.path}`);
      this.collectionRef.doc(`${this.inmuebleData.codigo}`).delete();
      this.hayInmueblePoder = false;
      this.traerInmueblePoder();
      this.inmueblesApoderados = [];
    });
  }

  setInmuebleApoderado(i: any) {
    this.path = `${this.asambleaSeleccionada}/Inmueble/Lista`;
    this.collectionPoderRef = this._firestore.collection<any>(`${this.path}`);
    this.inmueblePoder$ = this.collectionPoderRef.valueChanges();
    this.inmueblePoder$.subscribe((resp) => {
      resp.forEach((inmuebleRef: any) => {
        if (inmuebleRef.codigo == i) {
          console.log(inmuebleRef);
          this.inmuebleData = inmuebleRef;
        }
      });
    });
    setTimeout(() => {
      if (
        this.inmueblesApoderados.includes(i) ||
        this.inmuebleData.codigo == i
      ) {
        this.buttonDisabled = true;
        console.log(this.inmueblesApoderados, this.inmuebleData.codigo, i);
      } else {
        this.buttonDisabled = false;
      }
    }, 500);
  }
}
