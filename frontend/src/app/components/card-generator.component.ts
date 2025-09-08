import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService, CardNumberResponse, CardEnrollmentRequest, CardEnrollmentResponse } from '../services/card.service';

@Component({
  selector: 'app-card-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-generator.component.html',
  styleUrls: ['./card-generator.component.css']
})
export class CardGeneratorComponent {
  // Variables para generar número de tarjeta
  productId: string = '';
  productIdError: string = '';
  isGenerating: boolean = false;
  generatedCardNumber: CardNumberResponse | null = null;

  // Variables para activar tarjeta
  cardNumber: string = '';
  cardNumberError: string = '';
  cardholderName: string = '';
  cardholderNameError: string = '';
  isEnrolling: boolean = false;
  enrolledCard: CardEnrollmentResponse | null = null;

  // Variables para acciones adicionales
  isGettingInfo: boolean = false;
  isBlocking: boolean = false;
  isCheckingHealth: boolean = false;

  // Listado de tarjetas
  cards: any[] = [];
  isListing: boolean = false;
  listError: string = '';

  constructor(private cardService: CardService) {}

  /**
   * Generar número de tarjeta
   */
  generateCardNumber(): void {
    // Validar productId
    this.productIdError = '';
    if (!this.productId) {
      this.productIdError = 'El ID del producto es requerido';
      return;
    }
    if (!/^\d{6}$/.test(this.productId)) {
      this.productIdError = 'El ID del producto debe tener exactamente 6 dígitos';
      return;
    }

    this.isGenerating = true;
    console.log('🚀 Iniciando generación de número de tarjeta...');

    this.cardService.generateCardNumber(this.productId).subscribe({
      next: (response) => {
        this.generatedCardNumber = response;
        this.cardNumber = response.data.numeroTarjeta; // Auto-completar para activación
        this.isGenerating = false;
        console.log('🎉 Generación completada exitosamente');
      },
      error: (error) => {
        this.isGenerating = false;
        console.error('💥 Error en la generación:', error);
        this.productIdError = error.message || 'Error al generar número de tarjeta';
      }
    });
  }

  /**
   * Activar tarjeta
   */
  enrollCard(): void {
    // Validar datos
    this.cardNumberError = '';
    this.cardholderNameError = '';

    if (!this.cardNumber) {
      this.cardNumberError = 'El número de tarjeta es requerido';
      return;
    }
    if (!/^\d{16}$/.test(this.cardNumber)) {
      this.cardNumberError = 'El número de tarjeta debe tener exactamente 16 dígitos';
      return;
    }
    if (!this.cardholderName) {
      this.cardholderNameError = 'El nombre del titular es requerido';
      return;
    }
    if (this.cardholderName.length < 2) {
      this.cardholderNameError = 'El nombre del titular debe tener al menos 2 caracteres';
      return;
    }

    this.isEnrolling = true;
    console.log('🚀 Iniciando activación de tarjeta...');

    const cardData: CardEnrollmentRequest = {
      numeroTarjeta: this.cardNumber,
      nombreTitular: this.cardholderName
    };

    this.cardService.enrollCard(cardData).subscribe({
      next: (response) => {
        this.enrolledCard = response;
        this.isEnrolling = false;
        console.log('🎉 Activación completada exitosamente');
        // Refrescar lista de tarjetas tras activar
        this.loadCards();
      },
      error: (error) => {
        this.isEnrolling = false;
        console.error('💥 Error en la activación:', error);
        // Mostrar error específico según el tipo
        if (error.message.includes('Ya existe una tarjeta')) {
          this.cardNumberError = 'Ya existe una tarjeta con este número';
        } else {
          this.cardNumberError = error.message || 'Error al activar la tarjeta';
        }
      }
    });
  }

  /**
   * Obtener información de la tarjeta
   */
  getCardInfo(): void {
    if (!this.enrolledCard?.data.cardId) {
      console.error('❌ No hay tarjeta activada para consultar');
      return;
    }

    this.isGettingInfo = true;
    console.log('🚀 Obteniendo información de la tarjeta...');

    this.cardService.getCardInfo(this.enrolledCard.data.cardId).subscribe({
      next: (response) => {
        this.isGettingInfo = false;
        console.log('🎉 Información obtenida exitosamente');
      },
      error: (error) => {
        this.isGettingInfo = false;
        console.error('💥 Error al obtener información:', error);
      }
    });
  }

  /**
   * Bloquear tarjeta
   */
  blockCard(): void {
    if (!this.enrolledCard?.data.cardId) {
      console.error('❌ No hay tarjeta activada para bloquear');
      return;
    }

    this.isBlocking = true;
    console.log('🚀 Iniciando bloqueo de tarjeta...');

    this.cardService.blockCard(this.enrolledCard.data.cardId).subscribe({
      next: (response) => {
        this.isBlocking = false;
        console.log('🎉 Tarjeta bloqueada exitosamente');
        // Actualizar estado local
        if (this.enrolledCard) {
          this.enrolledCard.data.activa = false;
        }
      },
      error: (error) => {
        this.isBlocking = false;
        console.error('💥 Error al bloquear tarjeta:', error);
      }
    });
  }

  /**
   * Verificar estado del servidor
   */
  checkServerHealth(): void {
    this.isCheckingHealth = true;
    console.log('🚀 Verificando estado del servidor...');

    this.cardService.checkServerHealth().subscribe({
      next: (response) => {
        this.isCheckingHealth = false;
        console.log('🎉 Servidor funcionando correctamente');
      },
      error: (error) => {
        this.isCheckingHealth = false;
        console.error('💥 Error al verificar servidor:', error);
      }
    });
  }

  /**
   * Listar tarjetas
   */
  loadCards(): void {
    this.isListing = true;
    this.listError = '';
    console.log('🚀 Cargando listado de tarjetas...');

    this.cardService.listCards({ page: 1, limit: 10 }).subscribe({
      next: (response) => {
        this.isListing = false;
        // Backend suele responder { success, data: { items, total, page, limit } } o { success, data: [...] }
        const data = (response && response.data) ? response.data : response;
        this.cards = Array.isArray(data) ? data : (data.items || []);
        console.log(`📋 Tarjetas cargadas: ${this.cards.length}`);
      },
      error: (error) => {
        this.isListing = false;
        this.listError = error.message || 'Error al listar tarjetas';
        console.error('💥 Error al listar tarjetas:', error);
      }
    });
  }
}
