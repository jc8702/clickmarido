# AppointmentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**appointmentsControllerCreate**](AppointmentsApi.md#appointmentscontrollercreate) | **POST** /api/appointments |  |
| [**appointmentsControllerFindAll**](AppointmentsApi.md#appointmentscontrollerfindall) | **GET** /api/appointments |  |
| [**appointmentsControllerFindOne**](AppointmentsApi.md#appointmentscontrollerfindone) | **GET** /api/appointments/{id} |  |
| [**appointmentsControllerRemove**](AppointmentsApi.md#appointmentscontrollerremove) | **DELETE** /api/appointments/{id} |  |
| [**appointmentsControllerUpdate**](AppointmentsApi.md#appointmentscontrollerupdate) | **PUT** /api/appointments/{id} |  |



## appointmentsControllerCreate

> appointmentsControllerCreate(body)



### Example

```ts
import {
  Configuration,
  AppointmentsApi,
} from '';
import type { AppointmentsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AppointmentsApi();

  const body = {
    // object
    body: Object,
  } satisfies AppointmentsControllerCreateRequest;

  try {
    const data = await api.appointmentsControllerCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## appointmentsControllerFindAll

> appointmentsControllerFindAll(startDate, endDate, technicianId, clientId)



### Example

```ts
import {
  Configuration,
  AppointmentsApi,
} from '';
import type { AppointmentsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AppointmentsApi();

  const body = {
    // string
    startDate: startDate_example,
    // string
    endDate: endDate_example,
    // string
    technicianId: technicianId_example,
    // string
    clientId: clientId_example,
  } satisfies AppointmentsControllerFindAllRequest;

  try {
    const data = await api.appointmentsControllerFindAll(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **startDate** | `string` |  | [Defaults to `undefined`] |
| **endDate** | `string` |  | [Defaults to `undefined`] |
| **technicianId** | `string` |  | [Defaults to `undefined`] |
| **clientId** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## appointmentsControllerFindOne

> appointmentsControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  AppointmentsApi,
} from '';
import type { AppointmentsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AppointmentsApi();

  const body = {
    // string
    id: id_example,
  } satisfies AppointmentsControllerFindOneRequest;

  try {
    const data = await api.appointmentsControllerFindOne(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## appointmentsControllerRemove

> appointmentsControllerRemove(id)



### Example

```ts
import {
  Configuration,
  AppointmentsApi,
} from '';
import type { AppointmentsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AppointmentsApi();

  const body = {
    // string
    id: id_example,
  } satisfies AppointmentsControllerRemoveRequest;

  try {
    const data = await api.appointmentsControllerRemove(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## appointmentsControllerUpdate

> appointmentsControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  AppointmentsApi,
} from '';
import type { AppointmentsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AppointmentsApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies AppointmentsControllerUpdateRequest;

  try {
    const data = await api.appointmentsControllerUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

