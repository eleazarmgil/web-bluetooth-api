import { Component, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private device: Bluetooth.BluetoothDevice | null = null;
  private characteristic: Bluetooth.BluetoothRemoteGATTCharacteristic | null =
    null;
  connected: boolean = false;
  private els: HTMLElement[] = [];

  async connectToBluetooth() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Reemplazar con tu UUID de servicio
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
      this.characteristic = await service.getCharacteristic(
        'your_characteristic_uuid'
      ); // Reemplazar con UUID de característica
      this.connected = true;
      console.log('Conectado a', this.device.name);
    } catch (error) {
      console.error('Error al conectar', error);
    }
  }

  async sendData(message:string) {
    if (this.characteristic) {
      const data = new TextEncoder().encode(message); // Cambiar mensaje
      await this.characteristic.writeValue(data);
      console.log('Datos enviados');
    } else {
      console.error('No hay característica disponible para enviar datos.');
    }
  }

  ngAfterViewInit() {
    const dpads = Array.prototype.slice.call(
      document.getElementsByClassName('d-pad'),
      0
    );
    const opads = Array.prototype.slice.call(
      document.getElementsByClassName('o-pad'),
      0
    );
    this.els = dpads.concat(opads);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.nodeName === 'A') {
      event.preventDefault();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    switch (event.which) {
      case 37:
        this.dir('left');
        break;
      case 39:
        this.dir('right');
        break;
      case 38:
        this.dir('up');
        break;
      case 40:
        this.dir('down');
        break;
    }
  }

  private dir(direction: string) {
    for (let i = 0; i < this.els.length; i++) {
      const el = this.els[i];
      const d = el.className.indexOf('d-') !== -1;
      const what = d ? 'd-pad' : 'o-pad';
      console.log(what);
      el.className = `${what} ${direction}`;
    }
  }
}
