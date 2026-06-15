# MaterialsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**materialsControllerCreate**](MaterialsApi.md#materialscontrollercreate) | **POST** /api/materials |  |
| [**materialsControllerCreateMovement**](MaterialsApi.md#materialscontrollercreatemovement) | **POST** /api/materials/{id}/movements |  |
| [**materialsControllerFindAll**](MaterialsApi.md#materialscontrollerfindall) | **GET** /api/materials |  |
| [**materialsControllerFindMovements**](MaterialsApi.md#materialscontrollerfindmovements) | **GET** /api/materials/{id}/movements |  |
| [**materialsControllerFindOne**](MaterialsApi.md#materialscontrollerfindone) | **GET** /api/materials/{id} |  |
| [**materialsControllerRemove**](MaterialsApi.md#materialscontrollerremove) | **DELETE** /api/materials/{id} |  |
| [**materialsControllerUpdate**](MaterialsApi.md#materialscontrollerupdate) | **PUT** /api/materials/{id} |  |



## materialsControllerCreate

> materialsControllerCreate(body)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // object
    body: Object,
  } satisfies MaterialsControllerCreateRequest;

  try {
    const data = await api.materialsControllerCreate(body);
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


## materialsControllerCreateMovement

> materialsControllerCreateMovement(id, body)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerCreateMovementRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies MaterialsControllerCreateMovementRequest;

  try {
    const data = await api.materialsControllerCreateMovement(body);
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


## materialsControllerFindAll

> materialsControllerFindAll(page, limit, search, category, lowStock)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

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
    lowStock: lowStock_example,
  } satisfies MaterialsControllerFindAllRequest;

  try {
    const data = await api.materialsControllerFindAll(body);
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
| **lowStock** | `string` |  | [Defaults to `undefined`] |

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


## materialsControllerFindMovements

> materialsControllerFindMovements(id, page, limit)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerFindMovementsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // string
    id: id_example,
    // string
    page: page_example,
    // string
    limit: limit_example,
  } satisfies MaterialsControllerFindMovementsRequest;

  try {
    const data = await api.materialsControllerFindMovements(body);
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
| **page** | `string` |  | [Defaults to `undefined`] |
| **limit** | `string` |  | [Defaults to `undefined`] |

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


## materialsControllerFindOne

> materialsControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // string
    id: id_example,
  } satisfies MaterialsControllerFindOneRequest;

  try {
    const data = await api.materialsControllerFindOne(body);
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


## materialsControllerRemove

> materialsControllerRemove(id)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // string
    id: id_example,
  } satisfies MaterialsControllerRemoveRequest;

  try {
    const data = await api.materialsControllerRemove(body);
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


## materialsControllerUpdate

> materialsControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  MaterialsApi,
} from '';
import type { MaterialsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaterialsApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies MaterialsControllerUpdateRequest;

  try {
    const data = await api.materialsControllerUpdate(body);
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

