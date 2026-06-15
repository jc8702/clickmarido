# CompaniesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**companiesControllerCreate**](CompaniesApi.md#companiescontrollercreate) | **POST** /api/companies |  |
| [**companiesControllerFindAll**](CompaniesApi.md#companiescontrollerfindall) | **GET** /api/companies |  |
| [**companiesControllerFindOne**](CompaniesApi.md#companiescontrollerfindone) | **GET** /api/companies/{id} |  |
| [**companiesControllerRemove**](CompaniesApi.md#companiescontrollerremove) | **DELETE** /api/companies/{id} |  |
| [**companiesControllerUpdate**](CompaniesApi.md#companiescontrollerupdate) | **PUT** /api/companies/{id} |  |



## companiesControllerCreate

> companiesControllerCreate(body)



### Example

```ts
import {
  Configuration,
  CompaniesApi,
} from '';
import type { CompaniesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CompaniesApi();

  const body = {
    // object
    body: Object,
  } satisfies CompaniesControllerCreateRequest;

  try {
    const data = await api.companiesControllerCreate(body);
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


## companiesControllerFindAll

> companiesControllerFindAll(page, limit, search, active, state)



### Example

```ts
import {
  Configuration,
  CompaniesApi,
} from '';
import type { CompaniesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CompaniesApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    active: active_example,
    // string
    state: state_example,
  } satisfies CompaniesControllerFindAllRequest;

  try {
    const data = await api.companiesControllerFindAll(body);
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
| **active** | `string` |  | [Defaults to `undefined`] |
| **state** | `string` |  | [Defaults to `undefined`] |

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


## companiesControllerFindOne

> companiesControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  CompaniesApi,
} from '';
import type { CompaniesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CompaniesApi();

  const body = {
    // string
    id: id_example,
  } satisfies CompaniesControllerFindOneRequest;

  try {
    const data = await api.companiesControllerFindOne(body);
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


## companiesControllerRemove

> companiesControllerRemove(id)



### Example

```ts
import {
  Configuration,
  CompaniesApi,
} from '';
import type { CompaniesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CompaniesApi();

  const body = {
    // string
    id: id_example,
  } satisfies CompaniesControllerRemoveRequest;

  try {
    const data = await api.companiesControllerRemove(body);
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


## companiesControllerUpdate

> companiesControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  CompaniesApi,
} from '';
import type { CompaniesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CompaniesApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies CompaniesControllerUpdateRequest;

  try {
    const data = await api.companiesControllerUpdate(body);
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

