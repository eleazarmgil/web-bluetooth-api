import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone:true,
  template: `
    <h1>Enviar Datos por Bluetooth</h1>
    <button (click)="connectToBluetooth()">Conectar a Bluetooth</button>
    <button (click)="sendData()" [disabled]="!connected">Enviar Datos</button>
  `,
  styles: []
})
export class AppComponent {
  private device: Bluetooth.BluetoothDevice | null = null;
  private characteristic: Bluetooth.BluetoothRemoteGATTCharacteristic | null = null;
  connected: boolean = false;

  async connectToBluetooth() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['your_service_uuid'] }] // Reemplazar con tu UUID de servicio
      });

      if (!this.device) {
        console.error('No se pudo obtener el dispositivo Bluetooth.');
        return;
      }

      const server = await this.device.gatt?.connect();
      if (!server) {
        console.error('No se pudo conectar al servidor GATT.');
        return;
      }

      const service = await server.getPrimaryService('your_service_uuid'); // Reemplazar con UUID de servicio
      this.characteristic = await service.getCharacteristic('your_characteristic_uuid'); // Reemplazar con UUID de característica
      this.connected = true;
      console.log('Conectado a', this.device.name);
    } catch (error) {
      console.error('Error al conectar', error);
    }
  }

  async sendData() {
    if (this.characteristic) {
      const data = new TextEncoder().encode('Tu mensaje'); // Cambiar mensaje
      await this.characteristic.writeValue(data);
      console.log('Datos enviados');
    } else {
      console.error('No hay característica disponible para enviar datos.');
    }
  }
}
