# WhatsappApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**whatsappControllerConnectInstance**](WhatsappApi.md#whatsappcontrollerconnectinstance) | **POST** /api/whatsapp/instance/connect |  |
| [**whatsappControllerDisconnectInstance**](WhatsappApi.md#whatsappcontrollerdisconnectinstance) | **POST** /api/whatsapp/instance/disconnect |  |
| [**whatsappControllerGetConversations**](WhatsappApi.md#whatsappcontrollergetconversations) | **GET** /api/whatsapp/conversations |  |
| [**whatsappControllerGetInstance**](WhatsappApi.md#whatsappcontrollergetinstance) | **GET** /api/whatsapp/instance |  |
| [**whatsappControllerGetMessages**](WhatsappApi.md#whatsappcontrollergetmessages) | **GET** /api/whatsapp/conversations/{id}/messages |  |
| [**whatsappControllerHandleWebhook**](WhatsappApi.md#whatsappcontrollerhandlewebhook) | **POST** /api/whatsapp/webhook |  |
| [**whatsappControllerSendMessage**](WhatsappApi.md#whatsappcontrollersendmessage) | **POST** /api/whatsapp/conversations/{id}/send |  |



## whatsappControllerConnectInstance

> whatsappControllerConnectInstance()



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerConnectInstanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  try {
    const data = await api.whatsappControllerConnectInstance();
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


## whatsappControllerDisconnectInstance

> whatsappControllerDisconnectInstance()



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerDisconnectInstanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  try {
    const data = await api.whatsappControllerDisconnectInstance();
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


## whatsappControllerGetConversations

> whatsappControllerGetConversations(companyId)



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerGetConversationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies WhatsappControllerGetConversationsRequest;

  try {
    const data = await api.whatsappControllerGetConversations(body);
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


## whatsappControllerGetInstance

> whatsappControllerGetInstance(companyId)



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerGetInstanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  const body = {
    // string
    companyId: companyId_example,
  } satisfies WhatsappControllerGetInstanceRequest;

  try {
    const data = await api.whatsappControllerGetInstance(body);
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


## whatsappControllerGetMessages

> whatsappControllerGetMessages(id)



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerGetMessagesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  const body = {
    // string
    id: id_example,
  } satisfies WhatsappControllerGetMessagesRequest;

  try {
    const data = await api.whatsappControllerGetMessages(body);
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


## whatsappControllerHandleWebhook

> whatsappControllerHandleWebhook()



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerHandleWebhookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  try {
    const data = await api.whatsappControllerHandleWebhook();
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


## whatsappControllerSendMessage

> whatsappControllerSendMessage(id)



### Example

```ts
import {
  Configuration,
  WhatsappApi,
} from '';
import type { WhatsappControllerSendMessageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WhatsappApi();

  const body = {
    // string
    id: id_example,
  } satisfies WhatsappControllerSendMessageRequest;

  try {
    const data = await api.whatsappControllerSendMessage(body);
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

