# AiApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**aiControllerClassifyTicket**](AiApi.md#aicontrollerclassifyticket) | **POST** /api/ai/tickets/classify |  |
| [**aiControllerGenerateQuote**](AiApi.md#aicontrollergeneratequote) | **POST** /api/ai/quotes/generate |  |
| [**aiControllerSuggestCrossSell**](AiApi.md#aicontrollersuggestcrosssell) | **POST** /api/ai/sales/cross-sell |  |
| [**aiControllerSuggestUpsell**](AiApi.md#aicontrollersuggestupsell) | **POST** /api/ai/sales/upsell |  |
| [**aiControllerSummarize**](AiApi.md#aicontrollersummarize) | **POST** /api/ai/whatsapp/summarize |  |



## aiControllerClassifyTicket

> aiControllerClassifyTicket()



### Example

```ts
import {
  Configuration,
  AiApi,
} from '';
import type { AiControllerClassifyTicketRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AiApi();

  try {
    const data = await api.aiControllerClassifyTicket();
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


## aiControllerGenerateQuote

> aiControllerGenerateQuote()



### Example

```ts
import {
  Configuration,
  AiApi,
} from '';
import type { AiControllerGenerateQuoteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AiApi();

  try {
    const data = await api.aiControllerGenerateQuote();
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


## aiControllerSuggestCrossSell

> aiControllerSuggestCrossSell()



### Example

```ts
import {
  Configuration,
  AiApi,
} from '';
import type { AiControllerSuggestCrossSellRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AiApi();

  try {
    const data = await api.aiControllerSuggestCrossSell();
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


## aiControllerSuggestUpsell

> aiControllerSuggestUpsell()



### Example

```ts
import {
  Configuration,
  AiApi,
} from '';
import type { AiControllerSuggestUpsellRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AiApi();

  try {
    const data = await api.aiControllerSuggestUpsell();
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


## aiControllerSummarize

> aiControllerSummarize()



### Example

```ts
import {
  Configuration,
  AiApi,
} from '';
import type { AiControllerSummarizeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AiApi();

  try {
    const data = await api.aiControllerSummarize();
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

