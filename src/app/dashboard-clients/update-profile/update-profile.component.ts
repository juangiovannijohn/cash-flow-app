import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user: any
  loading = false;
  rowTitle:boolean = false
  updateProfileForm: FormGroup;
  updatePasswordForm: FormGroup;
  //cambio de password
  isPasswordVisible: boolean = true
  messageModal: string = '';
  classesModal: string = '';
  showAlert: boolean = false;

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) {
    this.updateProfileForm = this.formBuilder.group({
      username: ['', Validators.required],
      full_name: ['', Validators.required],
      website: ['', Validators.required],
    })
    this.updatePasswordForm = this.formBuilder.group({
      newPash: ['', [Validators.required, Validators.minLength(6)]],
      repeatPash: ['', [Validators.required, Validators.minLength(6)]],
    })

  }

  async ngOnInit(): Promise<void> {
    this.user = await this.supabase.getUser()
    console.log(this.user)
    this.updateProfileForm.patchValue({
      username: this.user.user_meta.username,
      full_name: this.user.user_meta.full_name,
      website: this.user.user_meta.website
    });
  }
  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const username = this.updateProfileForm.value.username as string
      const website = this.updateProfileForm.value.website as string
      const full_name = this.updateProfileForm.value.full_name as string
      const { error } = await this.supabase.updateProfile({
        id: this.user.id,
        username,
        website,
        full_name,
      })
      if (error) throw error
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`);
      }
    } finally {
      this.loading = false
    }
  }
  // Función para actualizar la contraseña
  async updatePassword() {
    try {
      this.loading = true
      if (this.updatePasswordForm.invalid) {
        throw new Error('Formulario inválido')
      }
      const newPassword = this.updatePasswordForm.value.newPash;
      const repeatPassword = this.updatePasswordForm.value.repeatPash;

      // Validamos que la nueva contraseña y la confirmación coincidan
      if (newPassword !== repeatPassword) {
        throw new Error('La nueva contraseña y la confirmación no coinciden.');
      }
      // La contraseña actual es válida, actualizamos la contraseña
      const updated = await this.supabase.updatePass(newPassword);
      if (updated.error) {
        throw new Error(`${updated.error}`);
      }

      this.openAlert('text-text', `Password actualizado correctamente`);
    } catch (error: any) {
      this.openAlert('text-red', `${error.message}`);
      console.error('Error al actualizar la contraseña:', error.message);
    }
    finally {
      this.loading = false
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  openAlert(className: string, message: string) {
    this.messageModal = message;
    this.classesModal = className;
    this.showAlert = true;
  }
  closeAlert() {
    this.messageModal = '';
    this.classesModal = '';
    this.showAlert = false;
  }

}
