// src/core/bluetooth.d.ts
declare global {
  namespace Bluetooth {
    interface BluetoothDevice {
      gatt?: BluetoothRemoteGATTServer;
      name?: string;
      // Agrega otras propiedades según sea necesario
    }

    interface BluetoothRemoteGATTServer {
      connect(): Promise<BluetoothRemoteGATTServer>;
      disconnect(): void;
      getPrimaryService(service: string | BluetoothUUID): Promise<BluetoothRemoteGATTService>;
    }

    interface BluetoothRemoteGATTService {
      getCharacteristic(characteristic: string | BluetoothUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    }

    interface BluetoothRemoteGATTCharacteristic {
      writeValue(value: ArrayBuffer | ArrayBufferView): Promise<void>;
    }

    interface BluetoothUUID {
      // Define los métodos y propiedades según sea necesario
    }
  }

  interface Navigator {
    bluetooth: {
      requestDevice(options?: RequestDeviceOptions): Promise<Bluetooth.BluetoothDevice>;
    };
  }
}

export {};
