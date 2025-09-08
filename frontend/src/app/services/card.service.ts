import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface CardNumberResponse {
  success: boolean;
  message: string;
  data: {
    productId: string;
    numeroTarjeta: string;
    timestamp: string;
  };
}

export interface CardEnrollmentRequest {
  numeroTarjeta: string;
  nombreTitular: string;
}

export interface CardEnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    cardId: string;
    productId: string;
    nombreTitular: string;
    fechaVencimiento: string;
    activa: boolean;
    saldo: number;
    moneda: string;
    fechaActivacion: string;
  };
}

export interface CardInfoResponse {
  success: boolean;
  data: {
    cardId: string;
    productId: string;
    nombreTitular: string;
    fechaVencimiento: string;
    activa: boolean;
    bloqueada: boolean;
    saldo: number;
    moneda: string;
    fechaCreacion: string;
    fechaActivacion: string;
    fechaBloqueo: string | null;
  };
}

export interface CardBlockResponse {
  success: boolean;
  message: string;
  data: {
    cardId: string;
    bloqueada: boolean;
    fechaBloqueo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly API_BASE_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Generar número de tarjeta
   * @param productId ID del producto (6 dígitos)
   * @returns Observable con la respuesta del servidor
   */
  generateCardNumber(productId: string): Observable<CardNumberResponse> {
    console.log(`🔄 Generando número de tarjeta para productId: ${productId}`);

    return this.http.get<CardNumberResponse>(`${this.API_BASE_URL}/card/${productId}/number`)
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor (Generar tarjeta):', response);
          if (response.success) {
            console.log(`🎯 Número de tarjeta generado: ${response.data.numeroTarjeta}`);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Activar tarjeta
   * @param cardData Datos de la tarjeta a activar
   * @returns Observable con la respuesta del servidor
   */
  enrollCard(cardData: CardEnrollmentRequest): Observable<CardEnrollmentResponse> {
    console.log(`🔄 Activando tarjeta: ${cardData.numeroTarjeta} para ${cardData.nombreTitular}`);

    return this.http.post<CardEnrollmentResponse>(`${this.API_BASE_URL}/card/enroll`, cardData)
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor (Activar tarjeta):', response);
          if (response.success) {
            console.log(`🎯 Tarjeta activada exitosamente: ${response.data.cardId}`);
            console.log(`📅 Fecha de vencimiento: ${response.data.fechaVencimiento}`);
            console.log(`💰 Saldo inicial: $${response.data.saldo} ${response.data.moneda}`);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener información de una tarjeta
   * @param cardId ID de la tarjeta (16 dígitos)
   * @returns Observable con la información de la tarjeta
   */
  getCardInfo(cardId: string): Observable<CardInfoResponse> {
    console.log(`🔄 Obteniendo información de tarjeta: ${cardId}`);

    return this.http.get<CardInfoResponse>(`${this.API_BASE_URL}/card/${cardId}`)
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor (Info tarjeta):', response);
          if (response.success) {
            console.log(`🎯 Tarjeta encontrada: ${response.data.cardId}`);
            console.log(`👤 Titular: ${response.data.nombreTitular}`);
            console.log(`📅 Vencimiento: ${response.data.fechaVencimiento}`);
            console.log(`🔒 Estado: ${response.data.activa ? 'Activa' : 'Inactiva'} | ${response.data.bloqueada ? 'Bloqueada' : 'No bloqueada'}`);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Bloquear tarjeta
   * @param cardId ID de la tarjeta (16 dígitos)
   * @returns Observable con la respuesta del servidor
   */
  blockCard(cardId: string): Observable<CardBlockResponse> {
    console.log(`🔄 Bloqueando tarjeta: ${cardId}`);

    return this.http.delete<CardBlockResponse>(`${this.API_BASE_URL}/card/${cardId}`)
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor (Bloquear tarjeta):', response);
          if (response.success) {
            console.log(`🎯 Tarjeta bloqueada exitosamente: ${response.data.cardId}`);
            console.log(`📅 Fecha de bloqueo: ${response.data.fechaBloqueo}`);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar estado del servidor
   * @returns Observable con el estado del servidor
   */
  checkServerHealth(): Observable<any> {
    console.log('🔄 Verificando estado del servidor...');

    return this.http.get(`${this.API_BASE_URL.replace('/api', '')}/health`)
      .pipe(
        tap(response => {
          console.log('✅ Estado del servidor:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Listar tarjetas con filtros opcionales y paginación
   * @param options Parámetros de consulta (page, limit, productId, activa, bloqueada)
   * @returns Observable con la lista de tarjetas
   */
  listCards(options?: {
    page?: number;
    limit?: number;
    productId?: string;
    activa?: boolean;
    bloqueada?: boolean;
  }): Observable<any> {
    console.log('🔄 Listando tarjetas...', options || {});

    let params = new HttpParams();
    if (options) {
      if (options.page !== undefined) params = params.set('page', String(options.page));
      if (options.limit !== undefined) params = params.set('limit', String(options.limit));
      if (options.productId) params = params.set('productId', options.productId);
      if (options.activa !== undefined) params = params.set('activa', String(options.activa));
      if (options.bloqueada !== undefined) params = params.set('bloqueada', String(options.bloqueada));
    }

    return this.http.get<any>(`${this.API_BASE_URL}/cards`, { params })
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor (Listar tarjetas):', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo centralizado de errores
   * @param error Error HTTP
   * @returns Observable con error manejado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
      console.error('❌ Error del cliente:', error.error);
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
      console.error('❌ Error del servidor:', error);

      // Si el servidor devuelve un mensaje de error personalizado
      if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
        console.error('❌ Mensaje de error del servidor:', error.error.message);
      }
    }

    console.error('❌ Error completo:', {
      status: error.status,
      statusText: error.statusText,
      message: errorMessage,
      url: error.url,
      error: error.error
    });

    return throwError(() => new Error(errorMessage));
  }
}
