# QuotesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**quotesControllerCreate**](QuotesApi.md#quotescontrollercreate) | **POST** /api/quotes |  |
| [**quotesControllerFindAll**](QuotesApi.md#quotescontrollerfindall) | **GET** /api/quotes |  |
| [**quotesControllerFindOne**](QuotesApi.md#quotescontrollerfindone) | **GET** /api/quotes/{id} |  |
| [**quotesControllerGetPdf**](QuotesApi.md#quotescontrollergetpdf) | **GET** /api/quotes/{id}/pdf |  |
| [**quotesControllerRemove**](QuotesApi.md#quotescontrollerremove) | **DELETE** /api/quotes/{id} |  |
| [**quotesControllerSaveSignature**](QuotesApi.md#quotescontrollersavesignature) | **POST** /api/quotes/{id}/sign |  |
| [**quotesControllerUpdate**](QuotesApi.md#quotescontrollerupdate) | **PUT** /api/quotes/{id} |  |



## quotesControllerCreate

> quotesControllerCreate(body)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // object
    body: Object,
  } satisfies QuotesControllerCreateRequest;

  try {
    const data = await api.quotesControllerCreate(body);
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


## quotesControllerFindAll

> quotesControllerFindAll(page, limit, search, status, clientId)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    status: status_example,
    // string
    clientId: clientId_example,
  } satisfies QuotesControllerFindAllRequest;

  try {
    const data = await api.quotesControllerFindAll(body);
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


## quotesControllerFindOne

> quotesControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesControllerFindOneRequest;

  try {
    const data = await api.quotesControllerFindOne(body);
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


## quotesControllerGetPdf

> quotesControllerGetPdf(id)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerGetPdfRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesControllerGetPdfRequest;

  try {
    const data = await api.quotesControllerGetPdf(body);
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


## quotesControllerRemove

> quotesControllerRemove(id)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesControllerRemoveRequest;

  try {
    const data = await api.quotesControllerRemove(body);
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


## quotesControllerSaveSignature

> quotesControllerSaveSignature(id)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerSaveSignatureRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesControllerSaveSignatureRequest;

  try {
    const data = await api.quotesControllerSaveSignature(body);
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


## quotesControllerUpdate

> quotesControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  QuotesApi,
} from '';
import type { QuotesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies QuotesControllerUpdateRequest;

  try {
    const data = await api.quotesControllerUpdate(body);
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

