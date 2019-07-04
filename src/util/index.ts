import { FetchResult } from "apollo-link";
import { DocumentNode } from "graphql";
import Observable from "zen-observable-ts";
import { SaturnVClient } from "../client";

export type RunableExecution<T> = (variables?: Variables, options?: GraphQLOptions) => T;
export type ClientMissingExecution<T> = (client: SaturnVClient, variables?: Variables, options?: GraphQLOptions) => T;
export type Variables = Record<string, any>;
export interface GraphQLOptions {
  variables?: Variables;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
}

function compileOneTime<T>(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions):
  RunableExecution<Promise<FetchResult<T>>>;
function compileOneTime<T>(query: DocumentNode, initialOptions?: GraphQLOptions):
  ClientMissingExecution<Promise<FetchResult<T>>>;
function compileOneTime<T>(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions,
  initialOptions?: GraphQLOptions,
):
  RunableExecution<Promise<FetchResult<T>>> | ClientMissingExecution<Promise<FetchResult<T>>> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables?: Variables,
      options?: GraphQLOptions,
    ) => clientOrInitialOptions.oneTimeRequest<T>({
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
    variables?: Variables,
    options?: GraphQLOptions,
  ) => client.oneTimeRequest<T>({
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

function compile<T>(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions):
  RunableExecution<Observable<FetchResult<T>>>;
function compile<T>(query: DocumentNode, initialOptions?: GraphQLOptions):
  ClientMissingExecution<Observable<FetchResult<T>>>;
function compile<T>(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions,
  initialOptions?: GraphQLOptions,
):
  RunableExecution<Observable<FetchResult<T>>> | ClientMissingExecution<Observable<FetchResult<T>>> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables?: Variables,
      options?: GraphQLOptions,
    ) => clientOrInitialOptions.request<T>({
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
    variables?: Variables,
    options?: GraphQLOptions,
  ) => client.request<T>({
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
