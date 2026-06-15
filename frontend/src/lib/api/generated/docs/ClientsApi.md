# ClientsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**clientsControllerCreate**](ClientsApi.md#clientscontrollercreate) | **POST** /api/clients |  |
| [**clientsControllerCreateHistory**](ClientsApi.md#clientscontrollercreatehistory) | **POST** /api/clients/{id}/history |  |
| [**clientsControllerFindAll**](ClientsApi.md#clientscontrollerfindall) | **GET** /api/clients |  |
| [**clientsControllerFindHistory**](ClientsApi.md#clientscontrollerfindhistory) | **GET** /api/clients/{id}/history |  |
| [**clientsControllerFindOne**](ClientsApi.md#clientscontrollerfindone) | **GET** /api/clients/{id} |  |
| [**clientsControllerRemove**](ClientsApi.md#clientscontrollerremove) | **DELETE** /api/clients/{id} |  |
| [**clientsControllerUpdate**](ClientsApi.md#clientscontrollerupdate) | **PUT** /api/clients/{id} |  |



## clientsControllerCreate

> clientsControllerCreate(body)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // object
    body: Object,
  } satisfies ClientsControllerCreateRequest;

  try {
    const data = await api.clientsControllerCreate(body);
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


## clientsControllerCreateHistory

> clientsControllerCreateHistory(id, body)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerCreateHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies ClientsControllerCreateHistoryRequest;

  try {
    const data = await api.clientsControllerCreateHistory(body);
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## clientsControllerFindAll

> clientsControllerFindAll(page, limit, search, leadSource, city)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    leadSource: leadSource_example,
    // string
    city: city_example,
  } satisfies ClientsControllerFindAllRequest;

  try {
    const data = await api.clientsControllerFindAll(body);
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
| **page** | `string` |  | [Defaults to `undefined`] |
| **limit** | `string` |  | [Defaults to `undefined`] |
| **search** | `string` |  | [Defaults to `undefined`] |
| **leadSource** | `string` |  | [Defaults to `undefined`] |
| **city** | `string` |  | [Defaults to `undefined`] |

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


## clientsControllerFindHistory

> clientsControllerFindHistory(id)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerFindHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    id: id_example,
  } satisfies ClientsControllerFindHistoryRequest;

  try {
    const data = await api.clientsControllerFindHistory(body);
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


## clientsControllerFindOne

> clientsControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    id: id_example,
  } satisfies ClientsControllerFindOneRequest;

  try {
    const data = await api.clientsControllerFindOne(body);
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


## clientsControllerRemove

> clientsControllerRemove(id)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    id: id_example,
  } satisfies ClientsControllerRemoveRequest;

  try {
    const data = await api.clientsControllerRemove(body);
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


## clientsControllerUpdate

> clientsControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  ClientsApi,
} from '';
import type { ClientsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientsApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies ClientsControllerUpdateRequest;

  try {
    const data = await api.clientsControllerUpdate(body);
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

