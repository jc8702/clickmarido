# FollowUpsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**followUpsControllerFindAll**](FollowUpsApi.md#followupscontrollerfindall) | **GET** /api/follow-ups |  |
| [**followUpsControllerForceSync**](FollowUpsApi.md#followupscontrollerforcesync) | **POST** /api/follow-ups/sync |  |
| [**followUpsControllerTriggerCronManually**](FollowUpsApi.md#followupscontrollertriggercronmanually) | **POST** /api/follow-ups/trigger |  |



## followUpsControllerFindAll

> followUpsControllerFindAll()



### Example

```ts
import {
  Configuration,
  FollowUpsApi,
} from '';
import type { FollowUpsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FollowUpsApi();

  try {
    const data = await api.followUpsControllerFindAll();
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


## followUpsControllerForceSync

> followUpsControllerForceSync()



### Example

```ts
import {
  Configuration,
  FollowUpsApi,
} from '';
import type { FollowUpsControllerForceSyncRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FollowUpsApi();

  try {
    const data = await api.followUpsControllerForceSync();
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


## followUpsControllerTriggerCronManually

> followUpsControllerTriggerCronManually()



### Example

```ts
import {
  Configuration,
  FollowUpsApi,
} from '';
import type { FollowUpsControllerTriggerCronManuallyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FollowUpsApi();

  try {
    const data = await api.followUpsControllerTriggerCronManually();
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

