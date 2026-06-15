# TechniciansApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**techniciansControllerCreate**](TechniciansApi.md#technicianscontrollercreate) | **POST** /api/technicians |  |
| [**techniciansControllerFindAll**](TechniciansApi.md#technicianscontrollerfindall) | **GET** /api/technicians |  |
| [**techniciansControllerFindOne**](TechniciansApi.md#technicianscontrollerfindone) | **GET** /api/technicians/{id} |  |
| [**techniciansControllerGetRanking**](TechniciansApi.md#technicianscontrollergetranking) | **GET** /api/technicians/ranking |  |
| [**techniciansControllerRemove**](TechniciansApi.md#technicianscontrollerremove) | **DELETE** /api/technicians/{id} |  |
| [**techniciansControllerUpdate**](TechniciansApi.md#technicianscontrollerupdate) | **PUT** /api/technicians/{id} |  |



## techniciansControllerCreate

> techniciansControllerCreate(body)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // object
    body: Object,
  } satisfies TechniciansControllerCreateRequest;

  try {
    const data = await api.techniciansControllerCreate(body);
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


## techniciansControllerFindAll

> techniciansControllerFindAll(companyId)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies TechniciansControllerFindAllRequest;

  try {
    const data = await api.techniciansControllerFindAll(body);
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
| **companyId** | `string` |  | [Defaults to `undefined`] |

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


## techniciansControllerFindOne

> techniciansControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // string
    id: id_example,
  } satisfies TechniciansControllerFindOneRequest;

  try {
    const data = await api.techniciansControllerFindOne(body);
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


## techniciansControllerGetRanking

> techniciansControllerGetRanking(companyId)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerGetRankingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies TechniciansControllerGetRankingRequest;

  try {
    const data = await api.techniciansControllerGetRanking(body);
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
| **companyId** | `string` |  | [Defaults to `undefined`] |

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


## techniciansControllerRemove

> techniciansControllerRemove(id)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // string
    id: id_example,
  } satisfies TechniciansControllerRemoveRequest;

  try {
    const data = await api.techniciansControllerRemove(body);
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


## techniciansControllerUpdate

> techniciansControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  TechniciansApi,
} from '';
import type { TechniciansControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TechniciansApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies TechniciansControllerUpdateRequest;

  try {
    const data = await api.techniciansControllerUpdate(body);
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

