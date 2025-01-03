
---

## API Routes

### 1. **POST `/register`**
#### Register a new device.

- **Description**: Registers a new device with a `deviceId` and a default status of `1`.
- **Request Body**:
    ```json
    {
      "deviceId": "unique-device-id"
    }
    ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "message": "Device registered successfully"
    }
    ```
  - **Error (400)**:
    - If `deviceId` is not provided:
      ```json
      {
        "error": "deviceId is required"
      }
      ```
    - If the device already exists or the request is invalid:
      ```json
      {
        "error": "Device already exists or invalid"
      }
      ```
- **Example**:
  - Register a device:
    ```bash
    curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"deviceId": "device123"}'
    ```

---

### 2. **GET `/devices`**
#### Get all devices or a specific device by `deviceId`.

- **Description**: Retrieves a list of all devices or a specific device if `deviceId` is provided as a query parameter.
- **Query Parameter**:
  - `deviceId` (optional): Filter devices by a specific `deviceId`.
  
- **Response**:
  - **Success (200)**:
    - If no `deviceId` is provided (get all devices):
      ```json
      [
        {
          "deviceId": "device123",
          "status": 1
        },
        {
          "deviceId": "device456",
          "status": 0
        }
      ]
      ```
    - If a specific `deviceId` is provided:
      ```json
      {
        "deviceId": "device123",
        "status": 1
      }
      ```
  - **Error (404)**:
    - If the device with the specified `deviceId` is not found:
      ```json
      {
        "error": "Device not found"
      }
      ```
- **Example**:
  - Fetch all devices:
    ```bash
    curl http://localhost:3000/api/devices
    ```
  - Fetch a specific device:
    ```bash
    curl http://localhost:3000/api/devices?deviceId=device123
    ```

---

### 3. **PATCH `/devices/:deviceId`**
#### Update the status of a specific device.

- **Description**: Updates the status of a device identified by `deviceId`.
- **Request Body**:
    ```json
    {
      "status": 0
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "message": "Status updated successfully"
    }
    ```
  - **Error (400)**:
    - If `status` is not provided:
      ```json
      {
        "error": "Status is required"
      }
      ```
  - **Error (404)**:
    - If the device with the specified `deviceId` is not found:
      ```json
      {
        "error": "Device not found"
      }
      ```
- **Example**:
  ```bash
  curl -X PATCH http://localhost:3000/api/devices/device123 -H "Content-Type: application/json" -d '{"status": 0}'


### 4. **DELETE `/devices/:deviceId`**
#### Delete a specific device by `deviceId`.

- **Description**: Deletes a device identified by `deviceId` from the system.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "message": "Device deleted successfully"
    }
    ```
  - **Error (404)**:
    - If the device with the specified `deviceId` is not found:
      ```json
      {
        "error": "Device not found"
      }
      ```
- **Example**:
  ```bash
  curl -X DELETE http://localhost:3000/api/devices/device123

