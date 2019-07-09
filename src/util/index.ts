import { FetchResult } from "apollo-link";
import { DocumentNode } from "graphql";
import Observable from "zen-observable-ts";
import { SaturnVClient } from "../client";

export type RunableExecution<T, V> = (variables: V, options?: GraphQLOptions<V>) => T;
export type ClientMissingExecution<T, V> = (client: SaturnVClient, variables: V, options?: GraphQLOptions<V>) => T;

export interface GraphQLOptions<V> {
  variables?: V;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
}

function compileOneTime<T, V>(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions<V>):
  RunableExecution<Promise<FetchResult<T>>, V>;
function compileOneTime<T, V>(query: DocumentNode, initialOptions?: GraphQLOptions<V>):
  ClientMissingExecution<Promise<FetchResult<T>>, V>;
function compileOneTime<T, V>(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions<V>,
  initialOptions?: GraphQLOptions<V>,
):
  RunableExecution<Promise<FetchResult<T>>, V> | ClientMissingExecution<Promise<FetchResult<T>>, V> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables: V,
      options?: GraphQLOptions<V>,
    ) => clientOrInitialOptions.oneTimeRequest<T, V>({
      ...initialOptions,
      ...options,
      query,
      variables: {
        ...variables,
        ...((initialOptions || {}).variables || {}),
        ...((options || {}).variables || {}),
      },
    });
  }
  return (
    client: SaturnVClient,
    variables: V,
    options?: GraphQLOptions<V>,
  ) => client.oneTimeRequest<T, V>({
    ...clientOrInitialOptions,
    ...initialOptions,
    ...options,
    query,
    variables: {
      ...variables,
      ...((clientOrInitialOptions || {}).variables || {}),
      ...((initialOptions || {}).variables || {}),
      ...((options || {}).variables || {}),
    },
  });
}

function compile<T, V>(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions<V>):
  RunableExecution<Observable<FetchResult<T>>, V>;
function compile<T, V>(query: DocumentNode, initialOptions?: GraphQLOptions<V>):
  ClientMissingExecution<Observable<FetchResult<T>>, V>;
function compile<T, V>(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions<V>,
  initialOptions?: GraphQLOptions<V>,
):
  RunableExecution<Observable<FetchResult<T>>, V> | ClientMissingExecution<Observable<FetchResult<T>>, V> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables: V,
      options?: GraphQLOptions<V>,
    ) => clientOrInitialOptions.request<T, V>({
      ...initialOptions,
      ...options,
      query,
      variables: {
        ...variables,
        ...((initialOptions || {}).variables || {}),
        ...((options || {}).variables || {}),
      },
    });
  }
  return (
    client: SaturnVClient,
    variables: V,
    options?: GraphQLOptions<V>,
  ) => client.request<T, V>({
    ...clientOrInitialOptions,
    ...initialOptions,
    ...options,
    query,
    variables: {
      ...variables,
      ...((clientOrInitialOptions || {}).variables || {}),
      ...((initialOptions || {}).variables || {}),
      ...((options || {}).variables || {}),
    },
  });
}

export const compileQuery = compileOneTime;
export const compileMutation = compileOneTime;
export const compileSubscription = compile;
