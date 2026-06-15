# WarrantiesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**warrantiesControllerCreate**](WarrantiesApi.md#warrantiescontrollercreate) | **POST** /api/warranties |  |
| [**warrantiesControllerFindAll**](WarrantiesApi.md#warrantiescontrollerfindall) | **GET** /api/warranties |  |
| [**warrantiesControllerFindOne**](WarrantiesApi.md#warrantiescontrollerfindone) | **GET** /api/warranties/{id} |  |
| [**warrantiesControllerRemove**](WarrantiesApi.md#warrantiescontrollerremove) | **DELETE** /api/warranties/{id} |  |
| [**warrantiesControllerUpdateStatus**](WarrantiesApi.md#warrantiescontrollerupdatestatus) | **PATCH** /api/warranties/{id}/status |  |



## warrantiesControllerCreate

> warrantiesControllerCreate()



### Example

```ts
import {
  Configuration,
  WarrantiesApi,
} from '';
import type { WarrantiesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarrantiesApi();

  try {
    const data = await api.warrantiesControllerCreate();
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


## warrantiesControllerFindAll

> warrantiesControllerFindAll()



### Example

```ts
import {
  Configuration,
  WarrantiesApi,
} from '';
import type { WarrantiesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarrantiesApi();

  try {
    const data = await api.warrantiesControllerFindAll();
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


## warrantiesControllerFindOne

> warrantiesControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  WarrantiesApi,
} from '';
import type { WarrantiesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarrantiesApi();

  const body = {
    // string
    id: id_example,
  } satisfies WarrantiesControllerFindOneRequest;

  try {
    const data = await api.warrantiesControllerFindOne(body);
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


## warrantiesControllerRemove

> warrantiesControllerRemove(id)



### Example

```ts
import {
  Configuration,
  WarrantiesApi,
} from '';
import type { WarrantiesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarrantiesApi();

  const body = {
    // string
    id: id_example,
  } satisfies WarrantiesControllerRemoveRequest;

  try {
    const data = await api.warrantiesControllerRemove(body);
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


## warrantiesControllerUpdateStatus

> warrantiesControllerUpdateStatus(id)



### Example

```ts
import {
  Configuration,
  WarrantiesApi,
} from '';
import type { WarrantiesControllerUpdateStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarrantiesApi();

  const body = {
    // string
    id: id_example,
  } satisfies WarrantiesControllerUpdateStatusRequest;

  try {
    const data = await api.warrantiesControllerUpdateStatus(body);
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

