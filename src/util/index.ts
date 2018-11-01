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

function compileOneTime(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions):
  RunableExecution<Promise<FetchResult>>;
function compileOneTime(query: DocumentNode, initialOptions?: GraphQLOptions):
  ClientMissingExecution<Promise<FetchResult>>;
function compileOneTime(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions,
  initialOptions?: GraphQLOptions,
):
  RunableExecution<Promise<FetchResult>> | ClientMissingExecution<Promise<FetchResult>> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables?: Variables,
      options?: GraphQLOptions,
    ) => clientOrInitialOptions.oneTimeRequest({
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
  ) => client.oneTimeRequest({
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

function compile(query: DocumentNode, client: SaturnVClient, initialOptions?: GraphQLOptions):
  RunableExecution<Observable<FetchResult>>;
function compile(query: DocumentNode, initialOptions?: GraphQLOptions):
  ClientMissingExecution<Observable<FetchResult>>;
function compile(
  query: DocumentNode,
  clientOrInitialOptions?: SaturnVClient | GraphQLOptions,
  initialOptions?: GraphQLOptions,
):
  RunableExecution<Observable<FetchResult>> | ClientMissingExecution<Observable<FetchResult>> {
  if (clientOrInitialOptions instanceof SaturnVClient) {
    return (
      variables?: Variables,
      options?: GraphQLOptions,
    ) => clientOrInitialOptions.request({
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
  ) => client.request({
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
