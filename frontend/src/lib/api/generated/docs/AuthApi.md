# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authControllerForgotPassword**](AuthApi.md#authcontrollerforgotpassword) | **POST** /api/auth/forgot-password |  |
| [**authControllerLogin**](AuthApi.md#authcontrollerlogin) | **POST** /api/auth/login |  |
| [**authControllerLogout**](AuthApi.md#authcontrollerlogout) | **POST** /api/auth/logout |  |
| [**authControllerMe**](AuthApi.md#authcontrollerme) | **GET** /api/auth/me |  |
| [**authControllerRefresh**](AuthApi.md#authcontrollerrefresh) | **POST** /api/auth/refresh |  |
| [**authControllerResetPassword**](AuthApi.md#authcontrollerresetpassword) | **POST** /api/auth/reset-password |  |



## authControllerForgotPassword

> authControllerForgotPassword(body)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerForgotPasswordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // object
    body: Object,
  } satisfies AuthControllerForgotPasswordRequest;

  try {
    const data = await api.authControllerForgotPassword(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerLogin

> authControllerLogin(body)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // object
    body: Object,
  } satisfies AuthControllerLoginRequest;

  try {
    const data = await api.authControllerLogin(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerLogout

> authControllerLogout(body)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerLogoutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // object
    body: Object,
  } satisfies AuthControllerLogoutRequest;

  try {
    const data = await api.authControllerLogout(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerMe

> authControllerMe()



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  try {
    const data = await api.authControllerMe();
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


## authControllerRefresh

> authControllerRefresh(body)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerRefreshRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // object
    body: Object,
  } satisfies AuthControllerRefreshRequest;

  try {
    const data = await api.authControllerRefresh(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerResetPassword

> authControllerResetPassword(body)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerResetPasswordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // object
    body: Object,
  } satisfies AuthControllerResetPasswordRequest;

  try {
    const data = await api.authControllerResetPassword(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

