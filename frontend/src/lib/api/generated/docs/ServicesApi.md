# ServicesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**servicesControllerConfirmImport**](ServicesApi.md#servicescontrollerconfirmimport) | **POST** /api/services/import/confirm |  |
| [**servicesControllerCreate**](ServicesApi.md#servicescontrollercreate) | **POST** /api/services |  |
| [**servicesControllerExportCsv**](ServicesApi.md#servicescontrollerexportcsv) | **GET** /api/services/export |  |
| [**servicesControllerFindAll**](ServicesApi.md#servicescontrollerfindall) | **GET** /api/services |  |
| [**servicesControllerFindOne**](ServicesApi.md#servicescontrollerfindone) | **GET** /api/services/{id} |  |
| [**servicesControllerRemove**](ServicesApi.md#servicescontrollerremove) | **DELETE** /api/services/{id} |  |
| [**servicesControllerUpdate**](ServicesApi.md#servicescontrollerupdate) | **PUT** /api/services/{id} |  |
| [**servicesControllerValidateCsv**](ServicesApi.md#servicescontrollervalidatecsv) | **POST** /api/services/import/validate |  |



## servicesControllerConfirmImport

> servicesControllerConfirmImport()



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerConfirmImportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  try {
    const data = await api.servicesControllerConfirmImport();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## servicesControllerCreate

> servicesControllerCreate(body)



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  const body = {
    // object
    body: Object,
  } satisfies ServicesControllerCreateRequest;

  try {
    const data = await api.servicesControllerCreate(body);
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


## servicesControllerExportCsv

> servicesControllerExportCsv()



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerExportCsvRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  try {
    const data = await api.servicesControllerExportCsv();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

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


## servicesControllerFindAll

> servicesControllerFindAll(page, limit, search, category, complexity, active)



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    category: category_example,
    // string
    complexity: complexity_example,
    // string
    active: active_example,
  } satisfies ServicesControllerFindAllRequest;

  try {
    const data = await api.servicesControllerFindAll(body);
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
| **category** | `string` |  | [Defaults to `undefined`] |
| **complexity** | `string` |  | [Defaults to `undefined`] |
| **active** | `string` |  | [Defaults to `undefined`] |

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


## servicesControllerFindOne

> servicesControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServicesControllerFindOneRequest;

  try {
    const data = await api.servicesControllerFindOne(body);
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


## servicesControllerRemove

> servicesControllerRemove(id)



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServicesControllerRemoveRequest;

  try {
    const data = await api.servicesControllerRemove(body);
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


## servicesControllerUpdate

> servicesControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies ServicesControllerUpdateRequest;

  try {
    const data = await api.servicesControllerUpdate(body);
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


## servicesControllerValidateCsv

> servicesControllerValidateCsv()



### Example

```ts
import {
  Configuration,
  ServicesApi,
} from '';
import type { ServicesControllerValidateCsvRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServicesApi();

  try {
    const data = await api.servicesControllerValidateCsv();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

