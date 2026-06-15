# ServiceOrdersPublicApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**serviceOrdersPublicControllerFindPublicOrder**](ServiceOrdersPublicApi.md#serviceorderspubliccontrollerfindpublicorder) | **GET** /api/public/service-orders/{id} |  |
| [**serviceOrdersPublicControllerSaveClientRating**](ServiceOrdersPublicApi.md#serviceorderspubliccontrollersaveclientrating) | **POST** /api/public/service-orders/{id}/rate |  |



## serviceOrdersPublicControllerFindPublicOrder

> serviceOrdersPublicControllerFindPublicOrder(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersPublicApi,
} from '';
import type { ServiceOrdersPublicControllerFindPublicOrderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersPublicApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersPublicControllerFindPublicOrderRequest;

  try {
    const data = await api.serviceOrdersPublicControllerFindPublicOrder(body);
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


## serviceOrdersPublicControllerSaveClientRating

> serviceOrdersPublicControllerSaveClientRating(id)



### Example

```ts
import {
  Configuration,
  ServiceOrdersPublicApi,
} from '';
import type { ServiceOrdersPublicControllerSaveClientRatingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ServiceOrdersPublicApi();

  const body = {
    // string
    id: id_example,
  } satisfies ServiceOrdersPublicControllerSaveClientRatingRequest;

  try {
    const data = await api.serviceOrdersPublicControllerSaveClientRating(body);
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

