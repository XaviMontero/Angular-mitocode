import { PacienteService } from './../../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-signo-dialogo',
  templateUrl: './signo-dialogo.component.html',
  styleUrls: ['./signo-dialogo.component.css']
})
export class SignoDialogoComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  pacienteCambioDialo = new Subject<Paciente>();

  constructor(
    private dialogRef: MatDialogRef<SignoDialogoComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl('', Validators.required),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });

 
  }

 

  get f() { return this.form.controls; }

  operar() {

    //TE ASEGURAS QUE EL FORM ESTE VALIDO PARA PROSEGUIR
    if (this.form.invalid) {
      return;
    }

    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    
      //servicio de registro
      this.pacienteService.registrar(paciente).subscribe(res => {
        this.pacienteService.pacienteCambioDialo.next(res); 
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.pacienteCambio.next(data);
        
          this.pacienteService.mensajeCambio.next('SE REGISTRO');
          this.dialogRef.close();
        });
      });
 
     
  }
}
