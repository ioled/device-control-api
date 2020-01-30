# Device Control API

Esta aplicación consulta la información alojada en el espacio de "IoT Core" de Google Cloud dependiendo de la configuración del usuario.

## Configuración del usuario

La configuración del usuario debe ser especificada tanto en el archivo **env.json** (projectId, region, registryId) como en la autenticación de _gcloud_ correspondiente en el sistema operativo.

## Rutas en funcionamiento

- Devuelve los registros en el IoT Core

```
    /registry
```

- Devuelve todos los dispositivos en el registro, con su correspondiente usuario: **ioled-devices**

```
    /devices
```

- Devuelve el estado del dispositivo en el registro: **ioled-devices**

```
    /device/:deviceId/state
```

- Devuelve la configuración del dispositivo en el registro: **ioled-devices**

```
    /device/:deviceId/config
```

- Devuelve el usuario correspondiente al dispositivo en el registro: **ioled-devices**

```
    /device/user/:deviceId
```
