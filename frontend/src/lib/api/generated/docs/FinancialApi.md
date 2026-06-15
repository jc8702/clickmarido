# FinancialApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**financialControllerCreate**](FinancialApi.md#financialcontrollercreate) | **POST** /api/financial |  |
| [**financialControllerFindAll**](FinancialApi.md#financialcontrollerfindall) | **GET** /api/financial |  |
| [**financialControllerFindOne**](FinancialApi.md#financialcontrollerfindone) | **GET** /api/financial/{id} |  |
| [**financialControllerGeneratePix**](FinancialApi.md#financialcontrollergeneratepix) | **POST** /api/financial/{id}/generate-pix |  |
| [**financialControllerGetDre**](FinancialApi.md#financialcontrollergetdre) | **GET** /api/financial/dre |  |
| [**financialControllerGetProjection**](FinancialApi.md#financialcontrollergetprojection) | **GET** /api/financial/projection |  |
| [**financialControllerGetSummary**](FinancialApi.md#financialcontrollergetsummary) | **GET** /api/financial/summary |  |
| [**financialControllerHandleWebhook**](FinancialApi.md#financialcontrollerhandlewebhook) | **POST** /api/financial/webhook/mercadopago |  |
| [**financialControllerRemove**](FinancialApi.md#financialcontrollerremove) | **DELETE** /api/financial/{id} |  |
| [**financialControllerUpdate**](FinancialApi.md#financialcontrollerupdate) | **PUT** /api/financial/{id} |  |



## financialControllerCreate

> financialControllerCreate(body)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // object
    body: Object,
  } satisfies FinancialControllerCreateRequest;

  try {
    const data = await api.financialControllerCreate(body);
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


## financialControllerFindAll

> financialControllerFindAll(companyId)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies FinancialControllerFindAllRequest;

  try {
    const data = await api.financialControllerFindAll(body);
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


## financialControllerFindOne

> financialControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    id: id_example,
  } satisfies FinancialControllerFindOneRequest;

  try {
    const data = await api.financialControllerFindOne(body);
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


## financialControllerGeneratePix

> financialControllerGeneratePix(id)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerGeneratePixRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    id: id_example,
  } satisfies FinancialControllerGeneratePixRequest;

  try {
    const data = await api.financialControllerGeneratePix(body);
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


## financialControllerGetDre

> financialControllerGetDre(companyId, month, year)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerGetDreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    companyId: companyId_example,
    // string
    month: month_example,
    // string
    year: year_example,
  } satisfies FinancialControllerGetDreRequest;

  try {
    const data = await api.financialControllerGetDre(body);
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
| **month** | `string` |  | [Defaults to `undefined`] |
| **year** | `string` |  | [Defaults to `undefined`] |

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


## financialControllerGetProjection

> financialControllerGetProjection(companyId, days)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerGetProjectionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    companyId: companyId_example,
    // string
    days: days_example,
  } satisfies FinancialControllerGetProjectionRequest;

  try {
    const data = await api.financialControllerGetProjection(body);
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
| **days** | `string` |  | [Defaults to `undefined`] |

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


## financialControllerGetSummary

> financialControllerGetSummary(companyId)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerGetSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies FinancialControllerGetSummaryRequest;

  try {
    const data = await api.financialControllerGetSummary(body);
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


## financialControllerHandleWebhook

> financialControllerHandleWebhook()



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerHandleWebhookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  try {
    const data = await api.financialControllerHandleWebhook();
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


## financialControllerRemove

> financialControllerRemove(id)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    id: id_example,
  } satisfies FinancialControllerRemoveRequest;

  try {
    const data = await api.financialControllerRemove(body);
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


## financialControllerUpdate

> financialControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  FinancialApi,
} from '';
import type { FinancialControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FinancialApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies FinancialControllerUpdateRequest;

  try {
    const data = await api.financialControllerUpdate(body);
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

