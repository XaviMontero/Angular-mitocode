import { SignoDialogoComponent } from './signo-dialogo/signo-dialogo.component';
import { SignoService } from './../../../_service/signo.service';
import { Signos } from './../../../_model/signos';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, startWith, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material';
 
@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})

export class SignoEdicionComponent implements OnInit {
 
  form: FormGroup;
  pacientes: Paciente[] = [];
  myControlPaciente: FormControl = new FormControl();
  pacienteSeleccionado: Paciente;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  pacientesFiltrados: Observable<any[]>;
  medicosFiltrados: Observable<any[]>;
  signos: Signos; 
  id:number;
  edicion:boolean; 
  

  constructor(
    private pacienteService: PacienteService ,
    private signosService:SignoService ,
     private route: ActivatedRoute, private router: Router,
      private dialog: MatDialog 
  ) { }

  ngOnInit() {
    this.signos = new Signos(); 


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  
    this.pacienteService.pacienteCambioDialo.subscribe( d=> {
      
      this.myControlPaciente = new FormControl(d);
      this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
      this.form = new FormGroup({
        
        'paciente': this.myControlPaciente,
        'fecha': new FormControl(new Date()),
        'temperatura': new FormControl(0),
        'pulso': new FormControl(0),
        'ritmo': new FormControl(0),
       
      });


    });
    this.form = new FormGroup({
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(0),
      'pulso': new FormControl(0),
      'ritmo': new FormControl(0),
     
    });

    this.listarPacientes();
 

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    
  }

  initForm(){
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(val =>{
        this.signos = val;
      this.myControlPaciente = new  FormControl(val.paciente);
        this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
        this.form = new FormGroup({
          'paciente': this.myControlPaciente ,
          'fecha': new FormControl(val.fecha),
          'temperatura': new FormControl(val.temperatura),
          'pulso': new FormControl(val.pulso),
          'ritmo': new FormControl(val.ritmo),
   

        });
    
      });
    }
  }
  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }
  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  estadoBotonRegistrar() {
    return ( this.pacienteSeleccionado === null);
  }

  aceptar() {
    this.signos.paciente = this.form.value['paciente'];
    this.signos.temperatura = this.form.value['temperatura'];
    this.signos.ritmo = this.form.value['ritmo'];
    this.signos.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');;
    this.signos.pulso = this.form.value['pulso'];
   
    if (this.edicion) {
      this.signosService.modificar(this.signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("Se Modifico");
      });
    }else{
      this.signosService.registrar(this.signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next("Se registró");
      });


    }
   
    this.router.navigate(['signo']);
   
  }



  limpiarControles() {
 
    this.pacienteSeleccionado = null;
  
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
 
  }
  nuevo(){
    this.dialog.open(SignoDialogoComponent, {
      width: '250px',
      data: null
    });
  }
  
 

}
