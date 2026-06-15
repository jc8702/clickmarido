# QuotesPublicApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**quotesPublicControllerFindPublicQuote**](QuotesPublicApi.md#quotespubliccontrollerfindpublicquote) | **GET** /api/public/quotes/{id} |  |
| [**quotesPublicControllerSavePublicSignature**](QuotesPublicApi.md#quotespubliccontrollersavepublicsignature) | **POST** /api/public/quotes/{id}/sign |  |



## quotesPublicControllerFindPublicQuote

> quotesPublicControllerFindPublicQuote(id)



### Example

```ts
import {
  Configuration,
  QuotesPublicApi,
} from '';
import type { QuotesPublicControllerFindPublicQuoteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesPublicApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesPublicControllerFindPublicQuoteRequest;

  try {
    const data = await api.quotesPublicControllerFindPublicQuote(body);
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


## quotesPublicControllerSavePublicSignature

> quotesPublicControllerSavePublicSignature(id)



### Example

```ts
import {
  Configuration,
  QuotesPublicApi,
} from '';
import type { QuotesPublicControllerSavePublicSignatureRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QuotesPublicApi();

  const body = {
    // string
    id: id_example,
  } satisfies QuotesPublicControllerSavePublicSignatureRequest;

  try {
    const data = await api.quotesPublicControllerSavePublicSignature(body);
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

