# ServiceOrdersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**serviceOrdersControllerAddChecklistItem**](ServiceOrdersApi.md#serviceorderscontrolleraddchecklistitem) | **POST** /api/service-orders/{id}/checklist |  |
| [**serviceOrdersControllerAddPhoto**](ServiceOrdersApi.md#serviceorderscontrolleraddphoto) | **POST** /api/service-orders/{id}/photos |  |
| [**serviceOrdersControllerCreate**](ServiceOrdersApi.md#serviceorderscontrollercreate) | **POST** /api/service-orders |  |
| [**serviceOrdersControllerFindAll**](ServiceOrdersApi.md#serviceorderscontrollerfindall) | **GET** /api/service-orders |  |
| [**serviceOrdersControllerFindOne**](ServiceOrdersApi.md#serviceorderscontrollerfindone) | **GET** /api/service-orders/{id} |  |
| [**serviceOrdersControllerFinishOrder**](ServiceOrdersApi.md#serviceorderscontrollerfinishorder) | **POST** /api/service-orders/{id}/finish |  |
| [**serviceOrdersControllerGenerateFromQuote**](ServiceOrdersApi.md#serviceorderscontrollergeneratefromquote) | **POST** /api/service-orders/from-quote/{quoteId} |  |
| [**serviceOrdersControllerToggleChecklist**](ServiceOrdersApi.md#serviceorderscontrollertogglechecklist) | **PUT** /api/service-orders/{id}/checklist/{checklistId} |  |
| [**serviceOrdersControllerUpdate**](ServiceOrdersApi.md#serviceorderscontrollerupdate) | **PUT** /api/service-orders/{id} |  |
| [**serviceOrdersControllerUpdateStatus**](ServiceOrdersApi.md#serviceorderscontrollerupdatestatus) | **POST** /api/service-orders/{id}/status |  |



## serviceOrdersControllerAddChecklistItem

> serviceOrdersControllerAddChecklistItem(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerAddChecklistItemRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersControllerAddChecklistItemRequest;

  try {
    const data = await api.serviceOrdersControllerAddChecklistItem(body);
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## serviceOrdersControllerAddPhoto

> serviceOrdersControllerAddPhoto(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerAddPhotoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersControllerAddPhotoRequest;

  try {
    const data = await api.serviceOrdersControllerAddPhoto(body);
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## serviceOrdersControllerCreate

> serviceOrdersControllerCreate(body)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // object
    body: Object,
  } satisfies ServiceOrdersControllerCreateRequest;

  try {
    const data = await api.serviceOrdersControllerCreate(body);
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


## serviceOrdersControllerFindAll

> serviceOrdersControllerFindAll(page, limit, search, status)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    status: status_example,
  } satisfies ServiceOrdersControllerFindAllRequest;

  try {
    const data = await api.serviceOrdersControllerFindAll(body);
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
| **status** | `string` |  | [Defaults to `undefined`] |

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


## serviceOrdersControllerFindOne

> serviceOrdersControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersControllerFindOneRequest;

  try {
    const data = await api.serviceOrdersControllerFindOne(body);
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


## serviceOrdersControllerFinishOrder

> serviceOrdersControllerFinishOrder(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerFinishOrderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersControllerFinishOrderRequest;

  try {
    const data = await api.serviceOrdersControllerFinishOrder(body);
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## serviceOrdersControllerGenerateFromQuote

> serviceOrdersControllerGenerateFromQuote(quoteId)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerGenerateFromQuoteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    quoteId: quoteId_example,
  } satisfies ServiceOrdersControllerGenerateFromQuoteRequest;

  try {
    const data = await api.serviceOrdersControllerGenerateFromQuote(body);
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
| **quoteId** | `string` |  | [Defaults to `undefined`] |

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


## serviceOrdersControllerToggleChecklist

> serviceOrdersControllerToggleChecklist(id, checklistId)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerToggleChecklistRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
    // string
    checklistId: checklistId_example,
  } satisfies ServiceOrdersControllerToggleChecklistRequest;

  try {
    const data = await api.serviceOrdersControllerToggleChecklist(body);
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
| **checklistId** | `string` |  | [Defaults to `undefined`] |

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


## serviceOrdersControllerUpdate

> serviceOrdersControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies ServiceOrdersControllerUpdateRequest;

  try {
    const data = await api.serviceOrdersControllerUpdate(body);
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


## serviceOrdersControllerUpdateStatus

> serviceOrdersControllerUpdateStatus(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersApi,
} from '';
import type { ServiceOrdersControllerUpdateStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersControllerUpdateStatusRequest;

  try {
    const data = await api.serviceOrdersControllerUpdateStatus(body);
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

