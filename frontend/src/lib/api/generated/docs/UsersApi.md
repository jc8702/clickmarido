# UsersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**usersControllerCreate**](UsersApi.md#userscontrollercreate) | **POST** /api/users |  |
| [**usersControllerFindAll**](UsersApi.md#userscontrollerfindall) | **GET** /api/users |  |
| [**usersControllerFindOne**](UsersApi.md#userscontrollerfindone) | **GET** /api/users/{id} |  |
| [**usersControllerGetRoles**](UsersApi.md#userscontrollergetroles) | **GET** /api/users/roles |  |
| [**usersControllerRemove**](UsersApi.md#userscontrollerremove) | **DELETE** /api/users/{id} |  |
| [**usersControllerUpdate**](UsersApi.md#userscontrollerupdate) | **PUT** /api/users/{id} |  |



## usersControllerCreate

> usersControllerCreate(body)



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // object
    body: Object,
  } satisfies UsersControllerCreateRequest;

  try {
    const data = await api.usersControllerCreate(body);
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


## usersControllerFindAll

> usersControllerFindAll(page, limit, search, roleId, active)



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // string
    page: page_example,
    // string
    limit: limit_example,
    // string
    search: search_example,
    // string
    roleId: roleId_example,
    // string
    active: active_example,
  } satisfies UsersControllerFindAllRequest;

  try {
    const data = await api.usersControllerFindAll(body);
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
| **roleId** | `string` |  | [Defaults to `undefined`] |
| **active** | `string` |  | [Defaults to `undefined`] |

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


## usersControllerFindOne

> usersControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // string
    id: id_example,
  } satisfies UsersControllerFindOneRequest;

  try {
    const data = await api.usersControllerFindOne(body);
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


## usersControllerGetRoles

> usersControllerGetRoles()



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerGetRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  try {
    const data = await api.usersControllerGetRoles();
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


## usersControllerRemove

> usersControllerRemove(id)



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // string
    id: id_example,
  } satisfies UsersControllerRemoveRequest;

  try {
    const data = await api.usersControllerRemove(body);
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


## usersControllerUpdate

> usersControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies UsersControllerUpdateRequest;

  try {
    const data = await api.usersControllerUpdate(body);
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

